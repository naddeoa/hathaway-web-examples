

export interface SearchRoute {
    readonly type: 'SearchRoute'
};

export interface UserRoute {
    readonly type: 'UserRoute',
    readonly user: string
};

export interface UnknownRoute {
    readonly type: 'UnknownRoute'
};

export type Route = SearchRoute | UserRoute | UnknownRoute;

export function parseRoute(): Route {
    let match;
    const { pathname } = window.location;

    if (match = pathname.match('^/user/(.*)/?$')) {
        const [, user] = match;
        return { type: 'UserRoute', user };
    }

    if (pathname.match('^/?$')) {
        return { type: 'SearchRoute' };
    }

    return { type: 'UnknownRoute' };
}

export function createPath(route: Route) {
    switch (route.type) {
        case 'SearchRoute':
            return '/';
        case 'UserRoute':
            return '/user/' + route.user
        case 'UnknownRoute':
            return '#'
    }
}