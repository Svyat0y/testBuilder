import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styles from './styles.module.scss';
import { Header } from "./components/Header/Header";
import { MainContent } from "./components/MainContent/MainContent";
import { ResizableSidebar } from "./components/ResizableSidebar/ResizableSidebar";
import {PreviewModal} from "./components/modal/Preview/Preview";

function App() {
	const [elementsInMainContent, setElementsInMainContent] = useState<Record<string, any>>({ 1: {} });
	const [currentPage, setCurrentPage] = useState<string>('1');
	const [pageOrder, setPageOrder] = useState<string[]>(['1']);
	const [isPreview, setIsPreview] = useState<boolean>(false);

	return (
		<DndProvider backend={HTML5Backend}>
			<div className={styles.app}>
				<Header />
				<PreviewModal isPreview={isPreview} pageOrder={pageOrder} elements={elementsInMainContent} onClose={() => setIsPreview(false)} />
				<div className={styles.content} style={{ filter: isPreview ? 'blur(5px)' : 'none' }}>
					<MainContent
						elements={elementsInMainContent}
						setElements={setElementsInMainContent}
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						pageOrder={pageOrder}
						setPageOrder={setPageOrder}
					/>
					<ResizableSidebar
						setPageOrder={setPageOrder}
						setCurrentPage={setCurrentPage}
						setElements={setElementsInMainContent}
						currentPage={currentPage}
						elementsInMainContent={elementsInMainContent}
						setIsPreview={setIsPreview}
					/>
				</div>
			</div>
		</DndProvider>
	);
}

export default App;