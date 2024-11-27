import React from 'react';
import { RouteMatch } from 'react-router';

export const DeepRouteMatchesContext = React.createContext<RouteMatch[]>([]);
