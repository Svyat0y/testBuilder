import React from 'react';
import styles from './styles.module.scss'

interface InputFieldProps {
	label: string;
	placeholder: string;
}

export const InputField: React.FC<InputFieldProps> = ({ label, placeholder }) => {
	return (
		<div className={styles.inputWrapper}>
			<label>{label}</label>
			<input type="text" placeholder={placeholder} />
		</div>
	);
};
