import { useDispatch, useSelector, useStore } from 'react-redux';
// eslint-disable-next-line fsd/forbidden-imports, fsd/no-global-store-imports
import type { RootState, AppDispatch, AppStore } from '@/app/redux/store';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
