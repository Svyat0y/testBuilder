import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import elements from '../../buildElements/elements.json';
import { SidebarItem } from "./SidebarItem/SidebarItem";

interface SideBarProps {
	setElements: React.Dispatch<React.SetStateAction<Record<string, any>>>;
	currentPage: string;
	elementsInMainContent: Record<string, any>;
	setIsPreview: React.Dispatch<React.SetStateAction<boolean>>;
	setPageOrder: React.Dispatch<React.SetStateAction<string[]>>;
}

export const Sidebar: React.FC<SideBarProps> = ({setPageOrder, setElements, setIsPreview, elementsInMainContent }) => {
	const [activeTab, setActiveTab] = useState<'elements' | 'json'>('elements');
	const [jsonText, setJsonText] = useState('');

	// Инициализация JSON
	useEffect(() => {
		setJsonText(JSON.stringify(elementsInMainContent, null, 2)); // Используем все страницы
	}, []);

	// Обновление JSON при изменении элементов в MainContent
	useEffect(() => {
		const jsonString = JSON.stringify(elementsInMainContent, null, 2);
		setJsonText(jsonString);
	}, [elementsInMainContent]); // Используем все страницы

	const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const text = e.target.value;
		setJsonText(text);

		try {
			const parsed = JSON.parse(text);

			if (typeof parsed === 'object' && parsed !== null) {
				// Проверяем, что все страницы указаны в parsed
				const pageKeys = Object.keys(parsed);

				// Устанавливаем новые элементы и порядок страниц
				setElements(parsed);
				setPageOrder(pageKeys); // Обновляем порядок страниц на основе ключей из JSON
			}
		} catch (err) {
			console.error('Invalid JSON:', err);
		}
	};

	return (
		<aside className={styles.sidebar}>
			<div className={styles.tabs}>
				<button
					className={activeTab === 'elements' ? styles.activeTab : ''}
					onClick={() => setActiveTab('elements')}
				>
					Elements
				</button>
				<button
					className={activeTab === 'json' ? styles.activeTab : ''}
					onClick={() => setActiveTab('json')}
				>
					JSON
				</button>
				<button className={styles.previewButton} onClick={() => setIsPreview(true)}>Preview</button>
			</div>

			{activeTab === 'elements' && (
				<div className={styles.elementsList}>
					{/* Отображаем элементы из elements.json */}
					{elements.map((item: any) => (
						<SidebarItem key={item.id} item={item} />
					))}
				</div>
			)}

			{activeTab === 'json' && (
				<div className={styles.jsonEditor}>
          <textarea
	          value={jsonText}
	          onChange={handleJsonChange}
	          rows={15}
	          style={{ maxHeight: '500px', resize: 'vertical' }}
          />
				</div>
			)}
		</aside>
	);
};