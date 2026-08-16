import { useDispatch, useSelector, useStore } from 'react-redux';
// eslint-disable-next-line
import type { RootState, AppDispatch, AppStore } from '@/app/redux';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
