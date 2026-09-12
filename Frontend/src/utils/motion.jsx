import { m as M } from 'framer-motion';

const initialFalse = (props) => ({ ...props, initial: false });

export const MotionDiv = (props) => <M.div {...initialFalse(props)} />;
export const MotionForm = (props) => <M.form {...initialFalse(props)} />;
export const MotionLi = (props) => <M.li {...initialFalse(props)} />;