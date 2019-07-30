import { AnyAction, combineReducers, Reducer } from 'redux';
import { ThunkAction } from 'redux-thunk';

import errorsReducer, { ErrorType } from '@/store/errors/reducer';
import productsReducer, { ProductsState } from '@/store/products/reducer';
import projectsReducer, { ProjectsState } from '@/store/projects/reducer';
import taskReducer, { TaskState } from '@/store/tasks/reducer';

import socketReducer, { Socket } from '@/store/socket/reducer';
import userReducer, { User } from '@/store/user/reducer';

export interface AppState {
  errors: ErrorType[];
  products: ProductsState;
  projects: ProjectsState;
  socket: Socket;
  user: User | null;
  tasks: TaskState;
}

export interface Action {
  type: string;
  payload?: any;
}

export type ThunkResult = ThunkAction<Promise<any>, AppState, void, AnyAction>;

const reducer: Reducer<AppState, Action> = combineReducers({
  errors: errorsReducer,
  products: productsReducer,
  projects: projectsReducer,
  socket: socketReducer,
  user: userReducer,
  tasks: taskReducer,
});

export default reducer;
