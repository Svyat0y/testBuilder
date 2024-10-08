import React, {useCallback, useEffect, useRef, useState} from 'react';
import styles from './styles.module.scss';
import {useDrop} from 'react-dnd';
import {DraggableElement} from "../DraggableElement/DraggableElement";

interface MainContentProps {
	elements: Record<string, any>;
	setElements: React.Dispatch<React.SetStateAction<Record<string, any>>>;
	currentPage: string;
	setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
	pageOrder: string[];
	setPageOrder: React.Dispatch<React.SetStateAction<string[]>>;
}

export const MainContent: React.FC<MainContentProps> = (
	{
		elements,
		setElements,
		currentPage,
		setCurrentPage,
		pageOrder,
		setPageOrder
	}) => {
	const currentPageRef = useRef(currentPage);
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

	useEffect(() => {
		currentPageRef.current = currentPage;
	}, [currentPage]);

	const [{isOver}, drop] = useDrop(() => ({
		accept: 'form-element',
		drop: (item: any) => addElementToMainContent(item),
		collect: (monitor) => ({
			isOver: !!monitor.isOver(),
		}),
	}));

	const addElementToMainContent = useCallback((item: any) => {
		const uniqueKey = `${item.label}-${Date.now()}`;

		setElements((prevElements) => ({
			...prevElements,
			[currentPageRef.current]: {
				...prevElements[currentPageRef.current],
				[uniqueKey]: {
					type: 'Input',
					config: {label: item.label, placeholder: item.placeholder},
				},
			},
		}));
	}, [setElements]);

	const removeElement = (key: string) => {
		setElements((prevElements) => {
			const updatedElements = {...prevElements};
			if (updatedElements[currentPageRef.current]) {
				delete updatedElements[currentPageRef.current][key];
			}
			return updatedElements;
		});
	};

	const moveElement = (key: string, targetPage: string) => {
		if (!targetPage || !elements[targetPage]) return;
		setElements((prevElements) => {
			const updatedElements = JSON.parse(JSON.stringify(prevElements));

			const elementToMove = updatedElements[currentPageRef.current][key];

			if (!elementToMove) return updatedElements;

			delete updatedElements[currentPageRef.current][key];

			updatedElements[targetPage] = {
				...updatedElements[targetPage],
				[key]: elementToMove,
			};

			return updatedElements;
		});
	};

	const updateElementConfig = (key: string, newConfig: any) => {
		setElements((prevElements) => ({
			...prevElements,
			[currentPageRef.current]: {
				...prevElements[currentPageRef.current],
				[key]: {
					...prevElements[currentPageRef.current][key],
					config: {...prevElements[currentPageRef.current][key].config, ...newConfig}
				}
			}
		}));
	};

	const addNewPage = () => {
		const newPageNumber = (Math.max(...pageOrder.map(page => parseInt(page))) + 1).toString();
		setElements((prev) => ({
			...prev,
			[newPageNumber]: {},
		}));
		setPageOrder((prevOrder) => [...prevOrder, newPageNumber]);
		setCurrentPage(newPageNumber);
	};

	const removePage = (pageName: string) => {
		if (pageName === '1' || pageName !== pageOrder[pageOrder.length - 1]) return;
		setElements((prevElements) => {
			const updatedElements = {...prevElements};
			delete updatedElements[pageName];
			return updatedElements;
		});
		setPageOrder((prevOrder) => {
			const updatedOrder = prevOrder.filter(page => page !== pageName);
			const newCurrentPage = updatedOrder[updatedOrder.length - 1] || '1';
			setCurrentPage(newCurrentPage);
			return updatedOrder;
		});
	};

	const moveElementWithDragAndDrop = (dragIndex: number, hoverIndex: number) => {
		setElements((prevElements) => {
			const currentElementsArray = Object.entries(prevElements[currentPageRef.current] || {});

			const [removed] = currentElementsArray.splice(dragIndex, 1);
			currentElementsArray.splice(hoverIndex, 0, removed);

			const reorderedElements = currentElementsArray.reduce((acc, [key, value]) => {
				acc[key] = value;
				return acc;
			}, {} as Record<string, any>);

			return {
				...prevElements,
				[currentPageRef.current]: reorderedElements,
			};
		});

		setHoveredIndex(hoverIndex);
	};

	return (
		<main className={styles.mainContent}>
			<div className={styles.pageControls}>
				{pageOrder.map((pageName, index) => (
					<div key={pageName} className={styles.pageTab}>
						<button
							className={currentPage === pageName ? styles.activePage : ''}
							onClick={() => setCurrentPage(pageName)}
						>
							{pageName}
						</button>
						{pageName !== '1' && index === pageOrder.length - 1 && (
							<button className={styles.deletePageBtn} onClick={() => removePage(pageName)}>x</button>
						)}
					</div>
				))}
				<button onClick={addNewPage}>Add Page</button>
			</div>

			<div
				ref={drop}
				style={{
					minHeight: '300px',
					border: '2px dashed #ccc',
					padding: '20px',
					backgroundColor: isOver ? '#f1f1f1' : '#fafafa',
				}}
			>
				<div className={styles.elementsWrapper}>
					{elements[currentPage] && Object.keys(elements[currentPage]).length > 0 ? (
						Object.keys(elements[currentPage]).map((key, index) => {
							const element = elements[currentPage][key];
							if (element.type === 'Input') {
								return (
									<DraggableElement
										key={key}
										id={key}
										index={index}
										moveElement={moveElementWithDragAndDrop} currentPage={currentPage}
										moveToPage={moveElement}
										pageOrder={pageOrder}
										removeElement={removeElement}
										setHoveredIndex={setHoveredIndex}
										hoveredIndex={hoveredIndex}>
										<div key={key} className={styles.elementContainer}>
											<div className={styles.elementSettings}>
												<label>
													Label:
													<input
														type="text"
														value={element.config.label}
														onChange={(e) => updateElementConfig(key, {label: e.target.value})}
													/>
												</label>
												<label>
													Placeholder:
													<input
														type="text"
														value={element.config.placeholder}
														onChange={(e) => updateElementConfig(key, {placeholder: e.target.value})}
													/>
												</label>
											</div>
										</div>
									</DraggableElement>
								);
							}
							return null;
						})
					) : (
						<p className={styles.dropZoneMessage}>Drag and drop elements here to customize this page</p>
					)}
				</div>
			</div>
		</main>
	);
};