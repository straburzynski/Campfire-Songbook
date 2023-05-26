import React from 'react';
import { classNames } from 'primereact/utils';

export const isFormFieldValid = (formik: any, fieldName: string) => {
    return !!(formik.touched[fieldName] && formik.errors[fieldName]);
};

export const getErrorClassName = (formik: any, fieldName: string) => {
    return classNames({ 'invalid': isFormFieldValid(formik, fieldName) });
};

export const getFormErrorMessage = (formik, name) => {
    return isFormFieldValid(formik, name) && <small className="p-error">{formik.errors[name]}</small>;
};
