/** Routes that render without the marketing nav and footer (checkout, onboarding…). */
export const FOCUS_ROUTES = ["/welcome"];

export const isFocusRoute = (pathname: string | null) => !!pathname && FOCUS_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));
