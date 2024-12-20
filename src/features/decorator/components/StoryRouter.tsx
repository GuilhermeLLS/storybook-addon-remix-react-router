import React, { useMemo } from 'react';
import { createMemoryRouter, RouteObject } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { useRouteObjectsDecorator } from '../hooks/useRouteObjectsDecorator';
import { useStory } from '../hooks/useStory';

import { injectStory } from '../utils/injectStory';
import { normalizeHistory } from '../utils/normalizeHistory';
import { normalizeRouting } from '../utils/normalizeRouting';
import { RouterLogger } from './RouterLogger';

export function StoryRouter() {
  const { addonParameters = {} } = useStory();
  const { hydrationData, routing, navigationHistory, location } = addonParameters;

  const decorateRouteObjects = useRouteObjectsDecorator();

  const memoryRouter = useMemo(() => {
    const normalizedRoutes = normalizeRouting(routing);
    const decoratedRoutes = decorateRouteObjects(normalizedRoutes);
    const injectedRoutes = injectStory(decoratedRoutes, <RouterLogger />);

    const { initialEntries, initialIndex } = normalizeHistory({ navigationHistory, location, routes: injectedRoutes });

    const resolvedOptions: Parameters<typeof createMemoryRouter>[1] = {
      initialEntries,
      initialIndex,
      hydrationData,
    };

    return createMemoryRouter(injectedRoutes as RouteObject[], resolvedOptions);
  }, [decorateRouteObjects, hydrationData, location, navigationHistory, routing]);

  const expandProps: Record<string, unknown> = {};

  return <RouterProvider router={memoryRouter} {...expandProps} />;
}
