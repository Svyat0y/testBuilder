import React, { useState } from 'react';
import styles from './styels.module.scss'
import {InputField} from "../../formElements/InputField/InputField";

interface PreviewModalProps {
	elements: Record<string, any>;
	pageOrder: string[];
	onClose: () => void;
	isPreview: boolean;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ isPreview, elements, pageOrder, onClose }) => {
	const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('desktop');
	const [currentPageIndex, setCurrentPageIndex] = useState(0);

	const currentPageKey = pageOrder[currentPageIndex];

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

	const renderElement = (element: any) => {
		switch (element.type) {
			case 'Input':
				return <InputField label={element.config.label} placeholder={element.config.placeholder} />;
			default:
				return null;
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
							return (
								<>{renderElement(element)}</>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
};