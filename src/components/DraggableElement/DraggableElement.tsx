import React from 'react';
import {useDrag, useDrop} from 'react-dnd';
import styles from './styles.module.scss';

interface DraggableElementProps {
	id: string;
	index: number;
	moveElement: (dragIndex: number, hoverIndex: number) => void;
	removeElement: (id: string) => void;
	moveToPage: (id: string, targetPage: string) => void;
	pageOrder: string[];
	currentPage: string;
	hoveredIndex: number | null;
	setHoveredIndex: (index: number | null) => void;
	children: React.ReactNode;
}

export const DraggableElement: React.FC<DraggableElementProps> = (
	{
		id,
		index,
		moveElement,
		removeElement,
		moveToPage,
		pageOrder,
		currentPage,
		hoveredIndex,
		setHoveredIndex,
		children,
	}) => {
	const elementRef = React.useRef<HTMLDivElement>(null);
	const dragHandleRef = React.useRef<HTMLSpanElement>(null);

	const [, drop] = useDrop({
		accept: 'draggable-element',
		hover: (item: { id: string; index: number }) => {
			if (!elementRef.current) return;

			const dragIndex = item.index;
			const hoverIndex = index;

			if (dragIndex === hoverIndex) return;

			moveElement(dragIndex, hoverIndex);
			item.index = hoverIndex;

			// Обновляем состояние hoveredIndex для отображения анимации
			setHoveredIndex(hoverIndex);
		},
		collect: (monitor) => {
			// Сбрасываем hoveredIndex при выходе из области
			if (!monitor.isOver()) {
				setHoveredIndex(null);
			}
		},
	});

	const [{isDragging}, drag, preview] = useDrag({
		type: 'draggable-element',
		item: {id, index},
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	});

	preview(elementRef);
	drag(dragHandleRef);
	drop(elementRef);

	return (
		<div
			ref={elementRef}
			className={`${styles.draggableElement} ${isDragging ? styles.dragging : ''} ${
				hoveredIndex === index ? styles.hovered : ''
			}`}
		>
			{children}
			<div className={styles.elementControls}>
				<button onClick={() => removeElement(id)}>Delete</button>
				<select onChange={(e) => moveToPage(id, e.target.value)} defaultValue="">
					<option value="" disabled>
						Move to...
					</option>
					{pageOrder
						.filter((page) => page !== currentPage)
						.map((page) => (
							<option key={page} value={page}>
								{page}
							</option>
						))}
				</select>
				<span ref={dragHandleRef} className={styles.dragHandle}>
                    &#9776;
                </span>
			</div>
		</div>
	);
};