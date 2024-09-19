import React from 'react';
import { useDrag } from 'react-dnd';
import styles from './styles.module.scss'

interface SidebarItemProps {
	item: {
		id: string;
		type: string;
		label: string;
		placeholder: string;
		title: string
	};
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ item }) => {
	const [, drag] = useDrag(() => ({
		type: 'form-element',
		item: { ...item },
	}));

	return (
		<div ref={drag} className={styles.sidebarItem}>
			{item.title}
		</div>
	);
};