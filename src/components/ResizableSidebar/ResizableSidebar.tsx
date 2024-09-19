import React, { useState } from 'react';
import {Sidebar} from "../Sidebar/Sidebar";
import styles from './styles.module.scss'

interface ResizableSidebarProps {
	elementsInMainContent: Record<string, any>;
	setElements: React.Dispatch<React.SetStateAction<Record<string, any>>>;
	setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
	currentPage: string;
	setIsPreview: React.Dispatch<React.SetStateAction<boolean>>;
	setPageOrder: React.Dispatch<React.SetStateAction<string[]>>;
}

export const ResizableSidebar: React.FC<ResizableSidebarProps> = ({setPageOrder, setElements, currentPage, setIsPreview, elementsInMainContent }) => {
	const [sidebarWidth, setSidebarWidth] = useState<number>(400);

	const handleMouseDown = (e: React.MouseEvent) => {
		e.preventDefault();

		const startX = e.clientX;
		const startWidth = sidebarWidth;

		const handleMouseMove = (event: MouseEvent) => {
			const deltaX = startX - event.clientX;
			const newSidebarWidth = startWidth + deltaX;
			if (newSidebarWidth > 400 && newSidebarWidth < 700) {
				setSidebarWidth(newSidebarWidth);
			}
		};

		const handleMouseUp = () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
	};

	return (
		<div className={styles.sidebarContainer} style={{ width: `${sidebarWidth}px` }}>
			<div className={styles.resizer} onMouseDown={handleMouseDown} />
			<Sidebar setPageOrder={setPageOrder} setIsPreview={setIsPreview} setElements={setElements} currentPage={currentPage} elementsInMainContent={elementsInMainContent}/>
		</div>
	);
};