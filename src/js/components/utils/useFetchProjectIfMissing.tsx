import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import { AppState, ThunkDispatch } from '@/store';
import { fetchObject } from '@/store/actions';
import { selectProject, selectProjectSlug } from '@/store/projects/selectors';
import { Repository } from '@/store/repositories/reducer';
import { OBJECT_TYPES } from '@/utils/constants';

export default (
  repository: Repository | null | undefined,
  routeProps: RouteComponentProps,
) => {
  const dispatch = useDispatch<ThunkDispatch>();
  const selectProjectWithProps = useCallback(selectProject, []);
  const selectProjectSlugWithProps = useCallback(selectProjectSlug, []);
  const project = useSelector((state: AppState) =>
    selectProjectWithProps(state, routeProps),
  );
  const projectSlug = useSelector((state: AppState) =>
    selectProjectSlugWithProps(state, routeProps),
  );

  useEffect(() => {
    if (repository && projectSlug && project === undefined) {
      // Fetch project from API
      dispatch(
        fetchObject({
          objectType: OBJECT_TYPES.PROJECT,
          filters: { repository: repository.id, slug: projectSlug },
        }),
      );
    }
  }, [dispatch, repository, project, projectSlug]);

  return { project, projectSlug };
};
