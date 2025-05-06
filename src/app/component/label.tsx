import React from 'react'
import Colors from '../utils/colors'

type CustomLabelProps = {
    title: string;
    isCompulsory?: boolean;
};

const CustomLabel = ({ title, isCompulsory=false }: CustomLabelProps) => {
  return (
    <label className="block text-sm font-medium leading-6 font-inter" style={{ color: Colors.labelColor }}>{title}<span className="text-danger">{isCompulsory ? " *" : ""}</span></label>
  )
}

export default CustomLabel