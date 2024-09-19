import React, { useState } from 'react';
import styles from './styels.module.scss';

interface PreviewModalProps {
	elements: Record<string, any>;
	pageOrder: string[]; // Добавляем pageOrder как пропс
	onClose: () => void;
	isPreview: boolean
}

export const PreviewModal: React.FC<PreviewModalProps> = ({isPreview, elements, pageOrder, onClose }) => {
	const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('desktop');
	const [currentPageIndex, setCurrentPageIndex] = useState(0);

	// Получаем ключ текущей страницы из pageOrder
	const currentPageKey = pageOrder[currentPageIndex];

	// Обработчики переключения страниц
	const handleNextPage = () => {
		if (currentPageIndex < pageOrder.length - 1) {
			setCurrentPageIndex(currentPageIndex + 1);
		}
	};

	const handlePreviousPage = () => {
		if (currentPageIndex > 0) {
			setCurrentPageIndex(currentPageIndex - 1);
		}
	};

	return (
		<div className={`${styles.previewModal} ${isPreview ? styles.active : ''}`}>
			<div className={styles.previewModalHeader}>
				<div className={styles.responsiveNav}>
					<button onClick={() => setViewMode('desktop')}>Desktop</button>
					<button onClick={() => setViewMode('mobile')}>Mobile</button>
				</div>
				<button onClick={onClose}>Close</button>
			</div>

			<div className={styles.previewModalContent} style={{ maxWidth: viewMode === 'mobile' ? '375px' : '100%' }}>
				{elements[currentPageKey] && (
					<div className={styles.previewPageContent}>
						<div className={styles.pageNav}>
							<button onClick={handlePreviousPage} disabled={currentPageIndex === 0}>Previous</button>
							<span className={styles.pageName}>{currentPageKey}</span>
							<button onClick={handleNextPage} disabled={currentPageIndex === pageOrder.length - 1}>Next</button>
						</div>
						{Object.keys(elements[currentPageKey]).map((key) => {
							const element = elements[currentPageKey][key];
							if (element.type === 'Input') {
								return (
									<div key={key}>
										<label>{element.config.label}</label>
										<input type="text" placeholder={element.config.placeholder} />
									</div>
								);
							}
							return null;
						})}
					</div>
				)}
			</div>
		</div>
	);
};