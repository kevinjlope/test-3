import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { Link, Links, Meta, Outlet, Scripts, ScrollRestoration, ServerRouter, UNSAFE_withComponentProps, redirect, useFetcher, useLoaderData, useLocation, useNavigation, useSearchParams, useSubmit } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Toaster, toast } from "sonner";
import * as React from "react";
import { cache, useEffect } from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Button } from "@base-ui/react/button";
import { Input } from "@base-ui/react/input";
import { Separator } from "@base-ui/react/separator";
import { Dialog } from "@base-ui/react/dialog";
import { Check, CheckIcon, ChevronDownIcon, ChevronRightIcon, ChevronUpIcon, Edit2, GripVertical, LayoutDashboard, Link as Link$1, Loader2, PanelLeftIcon, Plus, PlusCircle, Search, SearchIcon, ShoppingBasket, Tags, Trash2, X, XIcon } from "lucide-react";
import { Tooltip } from "@base-ui/react/tooltip";
import { Command } from "cmdk";
import { Popover } from "@base-ui/react/popover";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { and, asc, desc, eq, inArray, isNull, like, ne, sql } from "drizzle-orm";
import { v4 } from "uuid";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Select } from "@base-ui/react/select";
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region node_modules/@react-router/dev/dist/config/defaults/entry.server.node.tsx
var entry_server_node_exports = /* @__PURE__ */ __exportAll({
	default: () => handleRequest,
	streamTimeout: () => streamTimeout
});
var streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
	if (request.method.toUpperCase() === "HEAD") return new Response(null, {
		status: responseStatusCode,
		headers: responseHeaders
	});
	return new Promise((resolve, reject) => {
		let shellRendered = false;
		let userAgent = request.headers.get("user-agent");
		let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
		let timeoutId = setTimeout(() => abort(), streamTimeout + 1e3);
		const { pipe, abort } = renderToPipeableStream(/* @__PURE__ */ jsx(ServerRouter, {
			context: routerContext,
			url: request.url
		}), {
			[readyOption]() {
				shellRendered = true;
				const body = new PassThrough({ final(callback) {
					clearTimeout(timeoutId);
					timeoutId = void 0;
					callback();
				} });
				const stream = createReadableStreamFromReadable(body);
				responseHeaders.set("Content-Type", "text/html");
				pipe(body);
				resolve(new Response(stream, {
					headers: responseHeaders,
					status: responseStatusCode
				}));
			},
			onShellError(error) {
				reject(error);
			},
			onError(error) {
				responseStatusCode = 500;
				if (shellRendered) console.error(error);
			}
		});
	});
}
//#endregion
//#region app/root.tsx
var root_exports = /* @__PURE__ */ __exportAll({
	Layout: () => Layout,
	default: () => root_default,
	links: () => links
});
var links = () => [
	{
		rel: "preconnect",
		href: "https://fonts.googleapis.com"
	},
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous"
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
	}
];
function Layout({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		children: [/* @__PURE__ */ jsxs("head", { children: [
			/* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
			/* @__PURE__ */ jsx("meta", {
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			}),
			/* @__PURE__ */ jsx(Meta, {}),
			/* @__PURE__ */ jsx(Links, {})
		] }), /* @__PURE__ */ jsxs("body", { children: [
			children,
			/* @__PURE__ */ jsx(Toaster, {
				closeButton: true,
				position: "top-right"
			}),
			/* @__PURE__ */ jsx(ScrollRestoration, {}),
			/* @__PURE__ */ jsx(Scripts, {})
		] })]
	});
}
var root_default = UNSAFE_withComponentProps(function App() {
	return /* @__PURE__ */ jsx(Outlet, {});
});
//#endregion
//#region app/hooks/use-mobile.ts
var MOBILE_BREAKPOINT = 768;
function useIsMobile() {
	const [isMobile, setIsMobile] = React.useState(void 0);
	React.useEffect(() => {
		const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
		const onChange = () => {
			setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		};
		mql.addEventListener("change", onChange);
		setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		return () => mql.removeEventListener("change", onChange);
	}, []);
	return !!isMobile;
}
//#endregion
//#region app/lib/utils.ts
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
//#endregion
//#region app/components/ui/button.tsx
var buttonVariants = cva("group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
			outline: "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
			secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
			ghost: "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
			destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
			xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
			sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
			lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
			icon: "size-8",
			"icon-xs": "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
			"icon-sm": "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
			"icon-lg": "size-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button$1({ className, variant = "default", size = "default", ...props }) {
	return /* @__PURE__ */ jsx(Button, {
		"data-slot": "button",
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
//#endregion
//#region app/components/ui/input.tsx
function Input$1({ className, type, ...props }) {
	return /* @__PURE__ */ jsx(Input, {
		type,
		"data-slot": "input",
		className: cn("h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40", className),
		...props
	});
}
//#endregion
//#region app/components/ui/separator.tsx
function Separator$1({ className, orientation = "horizontal", ...props }) {
	return /* @__PURE__ */ jsx(Separator, {
		"data-slot": "separator",
		orientation,
		className: cn("shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch", className),
		...props
	});
}
//#endregion
//#region app/components/ui/sheet.tsx
function Sheet({ ...props }) {
	return /* @__PURE__ */ jsx(Dialog.Root, {
		"data-slot": "sheet",
		...props
	});
}
function SheetPortal({ ...props }) {
	return /* @__PURE__ */ jsx(Dialog.Portal, {
		"data-slot": "sheet-portal",
		...props
	});
}
function SheetOverlay({ className, ...props }) {
	return /* @__PURE__ */ jsx(Dialog.Backdrop, {
		"data-slot": "sheet-overlay",
		className: cn("fixed inset-0 z-50 bg-black/10 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs", className),
		...props
	});
}
function SheetContent({ className, children, side = "right", showCloseButton = true, ...props }) {
	return /* @__PURE__ */ jsxs(SheetPortal, { children: [/* @__PURE__ */ jsx(SheetOverlay, {}), /* @__PURE__ */ jsxs(Dialog.Popup, {
		"data-slot": "sheet-content",
		"data-side": side,
		className: cn("fixed z-50 flex flex-col gap-4 bg-popover bg-clip-padding text-sm text-popover-foreground shadow-lg transition duration-200 ease-in-out data-ending-style:opacity-0 data-starting-style:opacity-0 data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=bottom]:data-ending-style:translate-y-[2.5rem] data-[side=bottom]:data-starting-style:translate-y-[2.5rem] data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=left]:data-ending-style:translate-x-[-2.5rem] data-[side=left]:data-starting-style:translate-x-[-2.5rem] data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=right]:data-ending-style:translate-x-[2.5rem] data-[side=right]:data-starting-style:translate-x-[2.5rem] data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=top]:data-ending-style:translate-y-[-2.5rem] data-[side=top]:data-starting-style:translate-y-[-2.5rem] data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm", className),
		...props,
		children: [children, showCloseButton && /* @__PURE__ */ jsxs(Dialog.Close, {
			"data-slot": "sheet-close",
			render: /* @__PURE__ */ jsx(Button$1, {
				variant: "ghost",
				className: "absolute top-3 right-3",
				size: "icon-sm"
			}),
			children: [/* @__PURE__ */ jsx(XIcon, {}), /* @__PURE__ */ jsx("span", {
				className: "sr-only",
				children: "Close"
			})]
		})]
	})] });
}
function SheetHeader({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "sheet-header",
		className: cn("flex flex-col gap-0.5 p-4", className),
		...props
	});
}
function SheetTitle({ className, ...props }) {
	return /* @__PURE__ */ jsx(Dialog.Title, {
		"data-slot": "sheet-title",
		className: cn("font-heading text-base font-medium text-foreground", className),
		...props
	});
}
function SheetDescription({ className, ...props }) {
	return /* @__PURE__ */ jsx(Dialog.Description, {
		"data-slot": "sheet-description",
		className: cn("text-sm text-muted-foreground", className),
		...props
	});
}
//#endregion
//#region app/components/ui/tooltip.tsx
function Tooltip$1({ ...props }) {
	return /* @__PURE__ */ jsx(Tooltip.Root, {
		"data-slot": "tooltip",
		...props
	});
}
function TooltipTrigger({ ...props }) {
	return /* @__PURE__ */ jsx(Tooltip.Trigger, {
		"data-slot": "tooltip-trigger",
		...props
	});
}
function TooltipContent({ className, side = "top", sideOffset = 4, align = "center", alignOffset = 0, children, ...props }) {
	return /* @__PURE__ */ jsx(Tooltip.Portal, { children: /* @__PURE__ */ jsx(Tooltip.Positioner, {
		align,
		alignOffset,
		side,
		sideOffset,
		className: "isolate z-50",
		children: /* @__PURE__ */ jsxs(Tooltip.Popup, {
			"data-slot": "tooltip-content",
			className: cn("z-50 inline-flex w-fit max-w-xs origin-(--transform-origin) items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs text-background has-data-[slot=kbd]:pr-1.5 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", className),
			...props,
			children: [children, /* @__PURE__ */ jsx(Tooltip.Arrow, { className: "z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground data-[side=bottom]:top-1 data-[side=inline-end]:top-1/2! data-[side=inline-end]:-left-1 data-[side=inline-end]:-translate-y-1/2 data-[side=inline-start]:top-1/2! data-[side=inline-start]:-right-1 data-[side=inline-start]:-translate-y-1/2 data-[side=left]:top-1/2! data-[side=left]:-right-1 data-[side=left]:-translate-y-1/2 data-[side=right]:top-1/2! data-[side=right]:-left-1 data-[side=right]:-translate-y-1/2 data-[side=top]:-bottom-2.5" })]
		})
	}) });
}
//#endregion
//#region app/components/ui/sidebar.tsx
var SIDEBAR_COOKIE_NAME = "sidebar_state";
var SIDEBAR_COOKIE_MAX_AGE = 3600 * 24 * 7;
var SIDEBAR_WIDTH = "16rem";
var SIDEBAR_WIDTH_MOBILE = "18rem";
var SIDEBAR_WIDTH_ICON = "3rem";
var SIDEBAR_KEYBOARD_SHORTCUT = "b";
var SidebarContext = React.createContext(null);
function useSidebar() {
	const context = React.useContext(SidebarContext);
	if (!context) throw new Error("useSidebar must be used within a SidebarProvider.");
	return context;
}
function SidebarProvider({ defaultOpen = true, open: openProp, onOpenChange: setOpenProp, className, style, children, ...props }) {
	const isMobile = useIsMobile();
	const [openMobile, setOpenMobile] = React.useState(false);
	const [_open, _setOpen] = React.useState(defaultOpen);
	const open = openProp ?? _open;
	const setOpen = React.useCallback((value) => {
		const openState = typeof value === "function" ? value(open) : value;
		if (setOpenProp) setOpenProp(openState);
		else _setOpen(openState);
		document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
	}, [setOpenProp, open]);
	const toggleSidebar = React.useCallback(() => {
		return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
	}, [
		isMobile,
		setOpen,
		setOpenMobile
	]);
	React.useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
				event.preventDefault();
				toggleSidebar();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [toggleSidebar]);
	const state = open ? "expanded" : "collapsed";
	const contextValue = React.useMemo(() => ({
		state,
		open,
		setOpen,
		isMobile,
		openMobile,
		setOpenMobile,
		toggleSidebar
	}), [
		state,
		open,
		setOpen,
		isMobile,
		openMobile,
		setOpenMobile,
		toggleSidebar
	]);
	return /* @__PURE__ */ jsx(SidebarContext.Provider, {
		value: contextValue,
		children: /* @__PURE__ */ jsx("div", {
			"data-slot": "sidebar-wrapper",
			style: {
				"--sidebar-width": SIDEBAR_WIDTH,
				"--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
				...style
			},
			className: cn("group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar", className),
			...props,
			children
		})
	});
}
function Sidebar({ side = "left", variant = "sidebar", collapsible = "offcanvas", className, children, dir, ...props }) {
	const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
	if (collapsible === "none") return /* @__PURE__ */ jsx("div", {
		"data-slot": "sidebar",
		className: cn("flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground", className),
		...props,
		children
	});
	if (isMobile) return /* @__PURE__ */ jsx(Sheet, {
		open: openMobile,
		onOpenChange: setOpenMobile,
		...props,
		children: /* @__PURE__ */ jsxs(SheetContent, {
			dir,
			"data-sidebar": "sidebar",
			"data-slot": "sidebar",
			"data-mobile": "true",
			className: "w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden",
			style: { "--sidebar-width": SIDEBAR_WIDTH_MOBILE },
			side,
			children: [/* @__PURE__ */ jsxs(SheetHeader, {
				className: "sr-only",
				children: [/* @__PURE__ */ jsx(SheetTitle, { children: "Sidebar" }), /* @__PURE__ */ jsx(SheetDescription, { children: "Displays the mobile sidebar." })]
			}), /* @__PURE__ */ jsx("div", {
				className: "flex h-full w-full flex-col",
				children
			})]
		})
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "group peer hidden text-sidebar-foreground md:block",
		"data-state": state,
		"data-collapsible": state === "collapsed" ? collapsible : "",
		"data-variant": variant,
		"data-side": side,
		"data-slot": "sidebar",
		children: [/* @__PURE__ */ jsx("div", {
			"data-slot": "sidebar-gap",
			className: cn("relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear", "group-data-[collapsible=offcanvas]:w-0", "group-data-[side=right]:rotate-180", variant === "floating" || variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)")
		}), /* @__PURE__ */ jsx("div", {
			"data-slot": "sidebar-container",
			"data-side": side,
			className: cn("fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear data-[side=left]:left-0 data-[side=left]:group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)] data-[side=right]:right-0 data-[side=right]:group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)] md:flex", variant === "floating" || variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l", className),
			...props,
			children: /* @__PURE__ */ jsx("div", {
				"data-sidebar": "sidebar",
				"data-slot": "sidebar-inner",
				className: "flex size-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:shadow-sm group-data-[variant=floating]:ring-1 group-data-[variant=floating]:ring-sidebar-border",
				children
			})
		})]
	});
}
function SidebarTrigger({ className, onClick, ...props }) {
	const { toggleSidebar } = useSidebar();
	return /* @__PURE__ */ jsxs(Button$1, {
		"data-sidebar": "trigger",
		"data-slot": "sidebar-trigger",
		variant: "ghost",
		size: "icon-sm",
		className: cn(className),
		onClick: (event) => {
			onClick?.(event);
			toggleSidebar();
		},
		...props,
		children: [/* @__PURE__ */ jsx(PanelLeftIcon, {}), /* @__PURE__ */ jsx("span", {
			className: "sr-only",
			children: "Toggle Sidebar"
		})]
	});
}
function SidebarRail({ className, ...props }) {
	const { toggleSidebar } = useSidebar();
	return /* @__PURE__ */ jsx("button", {
		"data-sidebar": "rail",
		"data-slot": "sidebar-rail",
		"aria-label": "Toggle Sidebar",
		tabIndex: -1,
		onClick: toggleSidebar,
		title: "Toggle Sidebar",
		className: cn("absolute inset-y-0 z-20 hidden w-4 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:start-1/2 after:w-[2px] hover:after:bg-sidebar-border sm:flex ltr:-translate-x-1/2 rtl:-translate-x-1/2", "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize", "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize", "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full hover:group-data-[collapsible=offcanvas]:bg-sidebar", "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2", "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2", className),
		...props
	});
}
function SidebarInset({ className, ...props }) {
	return /* @__PURE__ */ jsx("main", {
		"data-slot": "sidebar-inset",
		className: cn("relative flex w-full flex-1 flex-col bg-background md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2", className),
		...props
	});
}
function SidebarHeader({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "sidebar-header",
		"data-sidebar": "header",
		className: cn("flex flex-col gap-2 p-2", className),
		...props
	});
}
function SidebarContent({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "sidebar-content",
		"data-sidebar": "content",
		className: cn("no-scrollbar flex min-h-0 flex-1 flex-col gap-0 overflow-auto group-data-[collapsible=icon]:overflow-hidden", className),
		...props
	});
}
function SidebarGroup({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "sidebar-group",
		"data-sidebar": "group",
		className: cn("relative flex w-full min-w-0 flex-col p-2", className),
		...props
	});
}
function SidebarGroupLabel({ className, render, ...props }) {
	return useRender({
		defaultTagName: "div",
		props: mergeProps({ className: cn("flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 ring-sidebar-ring outline-hidden transition-[margin,opacity] duration-200 ease-linear group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0", className) }, props),
		render,
		state: {
			slot: "sidebar-group-label",
			sidebar: "group-label"
		}
	});
}
function SidebarGroupContent({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "sidebar-group-content",
		"data-sidebar": "group-content",
		className: cn("w-full text-sm", className),
		...props
	});
}
function SidebarMenu({ className, ...props }) {
	return /* @__PURE__ */ jsx("ul", {
		"data-slot": "sidebar-menu",
		"data-sidebar": "menu",
		className: cn("flex w-full min-w-0 flex-col gap-0", className),
		...props
	});
}
function SidebarMenuItem({ className, ...props }) {
	return /* @__PURE__ */ jsx("li", {
		"data-slot": "sidebar-menu-item",
		"data-sidebar": "menu-item",
		className: cn("group/menu-item relative", className),
		...props
	});
}
var sidebarMenuButtonVariants = cva("peer/menu-button group/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm ring-sidebar-ring outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-open:hover:bg-sidebar-accent data-open:hover:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:font-medium data-active:text-sidebar-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0 [&>span:last-child]:truncate", {
	variants: {
		variant: {
			default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
			outline: "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]"
		},
		size: {
			default: "h-8 text-sm",
			sm: "h-7 text-xs",
			lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function SidebarMenuButton({ render, isActive = false, variant = "default", size = "default", tooltip, className, ...props }) {
	const { isMobile, state } = useSidebar();
	const comp = useRender({
		defaultTagName: "button",
		props: mergeProps({ className: cn(sidebarMenuButtonVariants({
			variant,
			size
		}), className) }, props),
		render: !tooltip ? render : /* @__PURE__ */ jsx(TooltipTrigger, { render }),
		state: {
			slot: "sidebar-menu-button",
			sidebar: "menu-button",
			size,
			active: isActive
		}
	});
	if (!tooltip) return comp;
	if (typeof tooltip === "string") tooltip = { children: tooltip };
	return /* @__PURE__ */ jsxs(Tooltip$1, { children: [comp, /* @__PURE__ */ jsx(TooltipContent, {
		side: "right",
		align: "center",
		hidden: state !== "collapsed" || isMobile,
		...tooltip
	})] });
}
//#endregion
//#region app/components/layout/AppSidebar.tsx
var items = [
	{
		title: "Dashboard",
		url: "/",
		icon: LayoutDashboard
	},
	{
		title: "All Products",
		url: "/products",
		icon: ShoppingBasket
	},
	{
		title: "Categories",
		url: "/categories",
		icon: Tags
	}
];
function AppSidebar({ ...props }) {
	const location = useLocation();
	return /* @__PURE__ */ jsxs(Sidebar, {
		collapsible: "icon",
		...props,
		children: [
			/* @__PURE__ */ jsx(SidebarHeader, { children: /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2 px-4 py-2",
				children: [/* @__PURE__ */ jsx("div", {
					className: "flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground",
					children: /* @__PURE__ */ jsx(ShoppingBasket, { className: "size-4" })
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col gap-0.5 leading-none",
					children: [/* @__PURE__ */ jsx("span", {
						className: "font-semibold",
						children: "Fifty Flowers"
					}), /* @__PURE__ */ jsx("span", {
						className: "text-xs text-muted-foreground",
						children: "Admin Portal"
					})]
				})]
			}) }),
			/* @__PURE__ */ jsx(SidebarContent, { children: /* @__PURE__ */ jsxs(SidebarGroup, { children: [/* @__PURE__ */ jsx(SidebarGroupLabel, { children: "Catalog" }), /* @__PURE__ */ jsx(SidebarGroupContent, { children: /* @__PURE__ */ jsx(SidebarMenu, { children: items.map((item) => /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsxs(SidebarMenuButton, {
				render: /* @__PURE__ */ jsx(Link, { to: item.url }),
				isActive: location.pathname === item.url,
				tooltip: item.title,
				children: [/* @__PURE__ */ jsx(item.icon, {}), /* @__PURE__ */ jsx("span", { children: item.title })]
			}) }, item.title)) }) })] }) }),
			/* @__PURE__ */ jsx(SidebarRail, {})
		]
	});
}
//#endregion
//#region app/components/ui/breadcrumb.tsx
function Breadcrumb({ className, ...props }) {
	return /* @__PURE__ */ jsx("nav", {
		"aria-label": "breadcrumb",
		"data-slot": "breadcrumb",
		className: cn(className),
		...props
	});
}
function BreadcrumbList({ className, ...props }) {
	return /* @__PURE__ */ jsx("ol", {
		"data-slot": "breadcrumb-list",
		className: cn("flex flex-wrap items-center gap-1.5 text-sm wrap-break-word text-muted-foreground", className),
		...props
	});
}
function BreadcrumbItem({ className, ...props }) {
	return /* @__PURE__ */ jsx("li", {
		"data-slot": "breadcrumb-item",
		className: cn("inline-flex items-center gap-1", className),
		...props
	});
}
function BreadcrumbLink({ className, render, ...props }) {
	return useRender({
		defaultTagName: "a",
		props: mergeProps({ className: cn("transition-colors hover:text-foreground", className) }, props),
		render,
		state: { slot: "breadcrumb-link" }
	});
}
function BreadcrumbPage({ className, ...props }) {
	return /* @__PURE__ */ jsx("span", {
		"data-slot": "breadcrumb-page",
		role: "link",
		"aria-disabled": "true",
		"aria-current": "page",
		className: cn("font-normal text-foreground", className),
		...props
	});
}
function BreadcrumbSeparator({ children, className, ...props }) {
	return /* @__PURE__ */ jsx("li", {
		"data-slot": "breadcrumb-separator",
		role: "presentation",
		"aria-hidden": "true",
		className: cn("[&>svg]:size-3.5", className),
		...props,
		children: children ?? /* @__PURE__ */ jsx(ChevronRightIcon, {})
	});
}
//#endregion
//#region app/components/layout/MainLayout.tsx
function MainLayout({ children }) {
	return /* @__PURE__ */ jsxs(SidebarProvider, { children: [/* @__PURE__ */ jsx(AppSidebar, {}), /* @__PURE__ */ jsxs(SidebarInset, { children: [/* @__PURE__ */ jsx("header", {
		className: "flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12",
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-2",
			children: [
				/* @__PURE__ */ jsx(SidebarTrigger, { className: "-ml-1" }),
				/* @__PURE__ */ jsx(Separator$1, {
					orientation: "vertical",
					className: "mr-2 h-4"
				}),
				/* @__PURE__ */ jsx(Breadcrumb, { children: /* @__PURE__ */ jsxs(BreadcrumbList, { children: [
					/* @__PURE__ */ jsx(BreadcrumbItem, {
						className: "hidden md:block",
						children: /* @__PURE__ */ jsx(BreadcrumbLink, {
							href: "/",
							children: "Catalog"
						})
					}),
					/* @__PURE__ */ jsx(BreadcrumbSeparator, { className: "hidden md:block" }),
					/* @__PURE__ */ jsx(BreadcrumbItem, { children: /* @__PURE__ */ jsx(BreadcrumbPage, { children: "All Products" }) })
				] }) })
			]
		})
	}), /* @__PURE__ */ jsx("main", {
		className: "flex flex-1 flex-col gap-4 p-4 md:p-8",
		children
	})] })] });
}
//#endregion
//#region app/components/ui/card.tsx
function Card({ className, size = "default", ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "card",
		"data-size": size,
		className: cn("group/card flex flex-col gap-4 overflow-hidden rounded-xl bg-card py-4 text-sm text-card-foreground ring-1 ring-foreground/10 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl", className),
		...props
	});
}
function CardHeader({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "card-header",
		className: cn("group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-4 group-data-[size=sm]/card:px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3", className),
		...props
	});
}
function CardContent({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "card-content",
		className: cn("px-4 group-data-[size=sm]/card:px-3", className),
		...props
	});
}
function CardFooter({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "card-footer",
		className: cn("flex items-center rounded-b-xl border-t bg-muted/50 p-4 group-data-[size=sm]/card:p-3", className),
		...props
	});
}
//#endregion
//#region app/components/ui/badge.tsx
var badgeVariants = cva("group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!", {
	variants: { variant: {
		default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
		secondary: "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
		destructive: "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
		outline: "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
		ghost: "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
		link: "text-primary underline-offset-4 hover:underline"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant = "default", render, ...props }) {
	return useRender({
		defaultTagName: "span",
		props: mergeProps({ className: cn(badgeVariants({ variant }), className) }, props),
		render,
		state: {
			slot: "badge",
			variant
		}
	});
}
//#endregion
//#region app/components/ProductCard.tsx
var formatPrice = (cents) => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD"
	}).format(cents / 100);
};
var ProductCard = React.memo(function ProductCard({ product }) {
	const primaryImage = product.images.slice().sort((a, b) => a.displayOrder - b.displayOrder)[0];
	const fetcher = useFetcher();
	if (fetcher.formData?.get("intent") === "delete" && fetcher.formData?.get("productId") === product.id) return null;
	return /* @__PURE__ */ jsxs(Card, {
		className: "overflow-hidden transition-all hover:shadow-md group",
		children: [
			/* @__PURE__ */ jsx(CardHeader, {
				className: "p-0",
				children: /* @__PURE__ */ jsxs("div", {
					className: "aspect-square relative bg-muted",
					children: [
						primaryImage ? /* @__PURE__ */ jsx("img", {
							src: primaryImage.url,
							alt: primaryImage.altText,
							className: "h-full w-full object-cover transition-transform group-hover:scale-105",
							loading: "lazy",
							decoding: "async"
						}) : /* @__PURE__ */ jsx("div", {
							className: "flex h-full w-full items-center justify-center text-muted-foreground",
							children: "No Image"
						}),
						/* @__PURE__ */ jsx(Badge, {
							className: "absolute top-2 right-2 uppercase bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none",
							variant: "secondary",
							children: product.category
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2",
							children: [/* @__PURE__ */ jsxs(Link, {
								to: `/products/${product.id}/edit`,
								className: cn(buttonVariants({
									size: "icon",
									variant: "secondary"
								}), "h-9 w-9"),
								children: [/* @__PURE__ */ jsx(Edit2, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", {
									className: "sr-only",
									children: "Edit"
								})]
							}), /* @__PURE__ */ jsxs(Button$1, {
								size: "icon",
								variant: "destructive",
								className: "h-9 w-9",
								onClick: () => {
									if (confirm("Are you sure you want to delete this product?")) fetcher.submit({
										intent: "delete",
										productId: product.id
									}, { method: "post" });
								},
								children: [/* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", {
									className: "sr-only",
									children: "Delete"
								})]
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ jsx(CardContent, {
				className: "p-4",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col gap-1",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "font-semibold leading-none tracking-tight group-hover:text-emerald-700 transition-colors",
						children: product.name
					}), /* @__PURE__ */ jsx("p", {
						className: "text-sm text-muted-foreground line-clamp-2",
						children: product.description
					})]
				})
			}),
			/* @__PURE__ */ jsx(CardFooter, {
				className: "flex items-center justify-between p-4 pt-0",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col",
					children: [/* @__PURE__ */ jsxs("span", {
						className: "text-lg font-bold",
						children: [formatPrice(product.priceCents), /* @__PURE__ */ jsxs("span", {
							className: "text-sm font-normal text-muted-foreground",
							children: [" / ", product.unitOfSale]
						})]
					}), /* @__PURE__ */ jsx("span", {
						className: "text-xs text-muted-foreground",
						children: product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : "Out of stock"
					})]
				})
			})
		]
	});
});
//#endregion
//#region app/components/CatalogSearch.tsx
function CatalogSearch() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [query, setQuery] = React.useState(searchParams.get("q") || "");
	const [isPending, startTransition] = React.useTransition();
	React.useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (query !== (searchParams.get("q") || "")) startTransition(() => {
				setSearchParams((prev) => {
					if (query) prev.set("q", query);
					else prev.delete("q");
					return prev;
				}, { replace: true });
			});
		}, 300);
		return () => clearTimeout(timeoutId);
	}, [
		query,
		searchParams,
		setSearchParams
	]);
	React.useEffect(() => {
		const q = searchParams.get("q") || "";
		if (q !== query) setQuery(q);
	}, [searchParams]);
	return /* @__PURE__ */ jsxs("div", {
		className: "relative w-full max-w-sm",
		children: [
			/* @__PURE__ */ jsx(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }),
			/* @__PURE__ */ jsx(Input$1, {
				type: "search",
				placeholder: "Search products...",
				className: "pl-8",
				value: query,
				onChange: (e) => setQuery(e.target.value)
			}),
			isPending && /* @__PURE__ */ jsx("div", {
				className: "absolute right-2.5 top-2.5",
				children: /* @__PURE__ */ jsx("div", { className: "h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" })
			})
		]
	});
}
//#endregion
//#region app/components/ui/textarea.tsx
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ jsx("textarea", {
		"data-slot": "textarea",
		className: cn("flex field-sizing-content min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40", className),
		...props
	});
}
//#endregion
//#region app/components/ui/input-group.tsx
function InputGroup({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "input-group",
		role: "group",
		className: cn("group/input-group relative flex h-8 w-full min-w-0 items-center rounded-lg border border-input transition-colors outline-none in-data-[slot=combobox-content]:focus-within:border-inherit in-data-[slot=combobox-content]:focus-within:ring-0 has-disabled:bg-input/50 has-disabled:opacity-50 has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-3 has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-3 has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto dark:bg-input/30 dark:has-disabled:bg-input/80 dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40 has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3 has-[>[data-align=inline-end]]:[&>input]:pr-1.5 has-[>[data-align=inline-start]]:[&>input]:pl-1.5", className),
		...props
	});
}
var inputGroupAddonVariants = cva("flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium text-muted-foreground select-none group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4", {
	variants: { align: {
		"inline-start": "order-first pl-2 has-[>button]:ml-[-0.3rem] has-[>kbd]:ml-[-0.15rem]",
		"inline-end": "order-last pr-2 has-[>button]:mr-[-0.3rem] has-[>kbd]:mr-[-0.15rem]",
		"block-start": "order-first w-full justify-start px-2.5 pt-2 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2",
		"block-end": "order-last w-full justify-start px-2.5 pb-2 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2"
	} },
	defaultVariants: { align: "inline-start" }
});
function InputGroupAddon({ className, align = "inline-start", ...props }) {
	return /* @__PURE__ */ jsx("div", {
		role: "group",
		"data-slot": "input-group-addon",
		"data-align": align,
		className: cn(inputGroupAddonVariants({ align }), className),
		onClick: (e) => {
			if (e.target.closest("button")) return;
			e.currentTarget.parentElement?.querySelector("input")?.focus();
		},
		...props
	});
}
cva("flex items-center gap-2 text-sm shadow-none", {
	variants: { size: {
		xs: "h-6 gap-1 rounded-[calc(var(--radius)-3px)] px-1.5 [&>svg:not([class*='size-'])]:size-3.5",
		sm: "",
		"icon-xs": "size-6 rounded-[calc(var(--radius)-3px)] p-0 has-[>svg]:p-0",
		"icon-sm": "size-8 p-0 has-[>svg]:p-0"
	} },
	defaultVariants: { size: "xs" }
});
//#endregion
//#region app/components/ui/command.tsx
function Command$1({ className, ...props }) {
	return /* @__PURE__ */ jsx(Command, {
		"data-slot": "command",
		className: cn("flex size-full flex-col overflow-hidden rounded-xl! bg-popover p-1 text-popover-foreground", className),
		...props
	});
}
function CommandInput({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "command-input-wrapper",
		className: "p-1 pb-0",
		children: /* @__PURE__ */ jsxs(InputGroup, {
			className: "h-8! rounded-lg! border-input/30 bg-input/30 shadow-none! *:data-[slot=input-group-addon]:pl-2!",
			children: [/* @__PURE__ */ jsx(Command.Input, {
				"data-slot": "command-input",
				className: cn("w-full text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50", className),
				...props
			}), /* @__PURE__ */ jsx(InputGroupAddon, { children: /* @__PURE__ */ jsx(SearchIcon, { className: "size-4 shrink-0 opacity-50" }) })]
		})
	});
}
function CommandList({ className, ...props }) {
	return /* @__PURE__ */ jsx(Command.List, {
		"data-slot": "command-list",
		className: cn("no-scrollbar max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none", className),
		...props
	});
}
function CommandEmpty({ className, ...props }) {
	return /* @__PURE__ */ jsx(Command.Empty, {
		"data-slot": "command-empty",
		className: cn("py-6 text-center text-sm", className),
		...props
	});
}
function CommandGroup({ className, ...props }) {
	return /* @__PURE__ */ jsx(Command.Group, {
		"data-slot": "command-group",
		className: cn("overflow-hidden p-1 text-foreground **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground", className),
		...props
	});
}
function CommandSeparator({ className, ...props }) {
	return /* @__PURE__ */ jsx(Command.Separator, {
		"data-slot": "command-separator",
		className: cn("-mx-1 h-px bg-border", className),
		...props
	});
}
function CommandItem({ className, children, ...props }) {
	return /* @__PURE__ */ jsxs(Command.Item, {
		"data-slot": "command-item",
		className: cn("group/command-item relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none in-data-[slot=dialog-content]:rounded-lg! data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-selected:bg-muted data-selected:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-selected:*:[svg]:text-foreground", className),
		...props,
		children: [children, /* @__PURE__ */ jsx(CheckIcon, { className: "ml-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:opacity-100" })]
	});
}
//#endregion
//#region app/components/ui/popover.tsx
function Popover$1({ ...props }) {
	return /* @__PURE__ */ jsx(Popover.Root, {
		"data-slot": "popover",
		...props
	});
}
function PopoverTrigger({ ...props }) {
	return /* @__PURE__ */ jsx(Popover.Trigger, {
		"data-slot": "popover-trigger",
		...props
	});
}
function PopoverContent({ className, align = "center", alignOffset = 0, side = "bottom", sideOffset = 4, ...props }) {
	return /* @__PURE__ */ jsx(Popover.Portal, { children: /* @__PURE__ */ jsx(Popover.Positioner, {
		align,
		alignOffset,
		side,
		sideOffset,
		className: "isolate z-50",
		children: /* @__PURE__ */ jsx(Popover.Popup, {
			"data-slot": "popover-content",
			className: cn("z-50 flex w-72 origin-(--transform-origin) flex-col gap-2.5 rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", className),
			...props
		})
	}) });
}
//#endregion
//#region app/db/schema.ts
var schema_exports = /* @__PURE__ */ __exportAll({
	categoryEnum: () => categoryEnum,
	productImages: () => productImages,
	products: () => products,
	unitOfSaleEnum: () => unitOfSaleEnum
});
var unitOfSaleEnum = [
	"stem",
	"bunch",
	"bouquet"
];
var categoryEnum = [
	"roses",
	"tulips",
	"sunflowers",
	"hydrangeas",
	"mixed"
];
var products = sqliteTable("products", {
	id: text("id").primaryKey().$defaultFn(() => v4()),
	name: text("name").notNull().unique(),
	priceCents: integer("price_cents").notNull(),
	stockQuantity: integer("stock_quantity").notNull(),
	unitOfSale: text("unit_of_sale", { enum: unitOfSaleEnum }).notNull(),
	description: text("description").notNull(),
	category: text("category", { enum: categoryEnum }).notNull(),
	deletedAt: integer("deleted_at", { mode: "timestamp" }),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`)
});
var productImages = sqliteTable("product_images", {
	id: text("id").primaryKey().$defaultFn(() => v4()),
	productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
	url: text("url").notNull(),
	altText: text("alt_text").notNull(),
	displayOrder: integer("display_order").notNull()
});
//#endregion
//#region app/components/CategoryFilter.tsx
function CategoryFilter() {
	const [searchParams, setSearchParams] = useSearchParams();
	const selectedCategories = new Set(searchParams.getAll("category"));
	const [isPending, startTransition] = React.useTransition();
	const toggleCategory = (category) => {
		startTransition(() => {
			setSearchParams((prev) => {
				const current = prev.getAll("category");
				if (current.includes(category)) {
					const next = current.filter((c) => c !== category);
					prev.delete("category");
					next.forEach((c) => prev.append("category", c));
				} else prev.append("category", category);
				return prev;
			}, { replace: true });
		});
	};
	const clearFilters = () => {
		startTransition(() => {
			setSearchParams((prev) => {
				prev.delete("category");
				return prev;
			}, { replace: true });
		});
	};
	return /* @__PURE__ */ jsxs(Popover$1, { children: [/* @__PURE__ */ jsxs(PopoverTrigger, {
		className: cn("inline-flex h-10 items-center justify-center rounded-lg border border-dashed border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"),
		children: [
			/* @__PURE__ */ jsx(PlusCircle, { className: "mr-2 h-4 w-4" }),
			"Categories",
			selectedCategories.size > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
				/* @__PURE__ */ jsx(Separator$1, {
					orientation: "vertical",
					className: "mx-2 h-4"
				}),
				/* @__PURE__ */ jsx(Badge, {
					variant: "secondary",
					className: "rounded-sm px-1 font-normal lg:hidden",
					children: selectedCategories.size
				}),
				/* @__PURE__ */ jsx("div", {
					className: "hidden space-x-1 lg:flex",
					children: selectedCategories.size > 2 ? /* @__PURE__ */ jsxs(Badge, {
						variant: "secondary",
						className: "rounded-sm px-1 font-normal",
						children: [selectedCategories.size, " selected"]
					}) : Array.from(selectedCategories).map((category) => /* @__PURE__ */ jsx(Badge, {
						variant: "secondary",
						className: "rounded-sm px-1 font-normal",
						children: category
					}, category))
				})
			] })
		]
	}), /* @__PURE__ */ jsx(PopoverContent, {
		className: "w-[200px] p-0",
		align: "start",
		children: /* @__PURE__ */ jsxs(Command$1, { children: [/* @__PURE__ */ jsx(CommandInput, { placeholder: "Category" }), /* @__PURE__ */ jsxs(CommandList, { children: [
			/* @__PURE__ */ jsx(CommandEmpty, { children: "No results found." }),
			/* @__PURE__ */ jsx(CommandGroup, { children: categoryEnum.map((category) => {
				const isSelected = selectedCategories.has(category);
				return /* @__PURE__ */ jsxs(CommandItem, {
					onSelect: () => toggleCategory(category),
					"data-checked": isSelected,
					children: [/* @__PURE__ */ jsx("div", {
						className: cn("mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary", isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible"),
						children: /* @__PURE__ */ jsx(Check, { className: cn("h-4 w-4") })
					}), /* @__PURE__ */ jsx("span", {
						className: "capitalize",
						children: category
					})]
				}, category);
			}) }),
			selectedCategories.size > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(CommandSeparator, {}), /* @__PURE__ */ jsx(CommandGroup, { children: /* @__PURE__ */ jsx(CommandItem, {
				onSelect: clearFilters,
				className: "justify-center text-center",
				children: "Clear filters"
			}) })] })
		] })] })
	})] });
}
//#endregion
//#region app/db/client.ts
var sqlite = new Database(process.env.DATABASE_URL || "sqlite.db");
sqlite.pragma("journal_mode = WAL");
var db = drizzle(sqlite, { schema: schema_exports });
//#endregion
//#region app/services/ProductService.ts
var ProductService = {
	/**
	* Fetch products with optional filters.
	* Uses React.cache for per-request deduplication.
	*/
	getProducts: cache(async (options = {}) => {
		const { search, categories, includeDeleted = false } = options;
		const conditions = [];
		if (!includeDeleted) conditions.push(isNull(products.deletedAt));
		if (search) conditions.push(like(products.name, `%${search}%`));
		if (categories && categories.length > 0) conditions.push(inArray(products.category, categories));
		const results = await db.select().from(products).where(conditions.length > 0 ? and(...conditions) : void 0).orderBy(desc(products.createdAt));
		if (results.length === 0) return [];
		const productIds = results.map((p) => p.id);
		const imagesByProductId = (await db.select().from(productImages).where(inArray(productImages.productId, productIds)).orderBy(asc(productImages.displayOrder))).reduce((acc, img) => {
			if (!acc[img.productId]) acc[img.productId] = [];
			acc[img.productId].push(img);
			return acc;
		}, {});
		return results.map((p) => ({
			...p,
			images: imagesByProductId[p.id] || []
		}));
	}),
	/**
	* Fetch a single product by ID.
	* Uses React.cache for per-request deduplication.
	*/
	getProductById: cache(async (id) => {
		const [product] = await db.select().from(products).where(eq(products.id, id)).limit(1);
		if (!product) return null;
		const images = await db.select().from(productImages).where(eq(productImages.productId, id)).orderBy(asc(productImages.displayOrder));
		return {
			...product,
			images
		};
	}),
	/**
	* Create a new product with its images.
	*/
	createProduct: async (productData, imagesData) => {
		return await db.transaction(async (tx) => {
			const [newProduct] = await tx.insert(products).values(productData).returning();
			let insertedImages = [];
			if (imagesData.length > 0) insertedImages = await tx.insert(productImages).values(imagesData.map((img) => ({
				...img,
				productId: newProduct.id
			}))).returning();
			return {
				...newProduct,
				images: insertedImages
			};
		});
	},
	/**
	* Update an existing product and optionally sync its images.
	*/
	updateProduct: async (id, productData, imagesData) => {
		return await db.transaction(async (tx) => {
			const [updatedProduct] = await tx.update(products).set({
				...productData,
				updatedAt: /* @__PURE__ */ new Date()
			}).where(eq(products.id, id)).returning();
			if (!updatedProduct) return null;
			if (imagesData) {
				await tx.delete(productImages).where(eq(productImages.productId, id));
				if (imagesData.length > 0) await tx.insert(productImages).values(imagesData.map((img) => ({
					...img,
					productId: id
				})));
			}
			const finalImages = await tx.select().from(productImages).where(eq(productImages.productId, id)).orderBy(asc(productImages.displayOrder));
			return {
				...updatedProduct,
				images: finalImages
			};
		});
	},
	/**
	* Check if a product name is already taken.
	*/
	checkNameUniqueness: async (name, excludeId) => {
		const conditions = [eq(products.name, name)];
		if (excludeId) conditions.push(ne(products.id, excludeId));
		const [existing] = await db.select().from(products).where(and(...conditions)).limit(1);
		return !existing;
	},
	/**
	* Soft delete a product.
	*/
	softDelete: async (id) => {
		await db.update(products).set({ deletedAt: /* @__PURE__ */ new Date() }).where(eq(products.id, id));
	},
	/**
	* Restore a soft-deleted product.
	*/
	restore: async (id) => {
		await db.update(products).set({ deletedAt: null }).where(eq(products.id, id));
	}
};
//#endregion
//#region app/routes/home.tsx
var home_exports = /* @__PURE__ */ __exportAll({
	action: () => action$2,
	default: () => home_default,
	loader: () => loader$1,
	meta: () => meta
});
var meta = () => {
	return [{ title: "Fifty Flowers - Catalog Management" }, {
		name: "description",
		content: "Manage flower products efficiently."
	}];
};
async function loader$1({ request }) {
	const url = new URL(request.url);
	const search = url.searchParams.get("q") || void 0;
	const categories = url.searchParams.getAll("category");
	return { products: await ProductService.getProducts({
		search,
		categories: categories.length > 0 ? categories : void 0
	}) };
}
async function action$2({ request }) {
	const formData = await request.formData();
	const intent = formData.get("intent");
	const productId = formData.get("productId");
	if (intent === "delete") {
		await ProductService.softDelete(productId);
		return {
			success: true,
			intent: "delete",
			productId
		};
	}
	if (intent === "restore") {
		await ProductService.restore(productId);
		return {
			success: true,
			intent: "restore",
			productId
		};
	}
	return { success: false };
}
var home_default = UNSAFE_withComponentProps(function Home() {
	const { products } = useLoaderData();
	const fetcher = useFetcher();
	useEffect(() => {
		if (fetcher.data && fetcher.data.success) {
			if (fetcher.data.intent === "delete") {
				const productId = fetcher.data.productId;
				toast.success("Product deleted", { action: {
					label: "Undo",
					onClick: () => {
						const formData = new FormData();
						formData.append("intent", "restore");
						formData.append("productId", productId);
						fetcher.submit(formData, { method: "post" });
					}
				} });
			} else if (fetcher.data.intent === "restore") toast.success("Product restored");
		}
	}, [fetcher.data]);
	return /* @__PURE__ */ jsx(MainLayout, { children: /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
					className: "text-3xl font-bold tracking-tight",
					children: "Products"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-muted-foreground",
					children: "Manage your flower catalog, stock, and pricing."
				})] }), /* @__PURE__ */ jsx(Button$1, {
					asChild: true,
					className: "bg-emerald-600 hover:bg-emerald-700",
					children: /* @__PURE__ */ jsxs(Link, {
						to: "/products/new",
						children: [/* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }), "Add Product"]
					})
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-center",
				children: [/* @__PURE__ */ jsx(CatalogSearch, {}), /* @__PURE__ */ jsx(CategoryFilter, {})]
			}),
			products.length > 0 ? /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
				children: products.map((product) => /* @__PURE__ */ jsx(ProductCard, { product }, product.id))
			}) : /* @__PURE__ */ jsxs("div", {
				className: "flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in zoom-in duration-300",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted",
						children: /* @__PURE__ */ jsx("span", {
							className: "text-2xl",
							children: "🔍"
						})
					}),
					/* @__PURE__ */ jsx("h3", {
						className: "mt-4 text-lg font-semibold",
						children: "No products found"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mb-4 mt-2 text-sm text-muted-foreground",
						children: "Try adjusting your search or filters to find what you're looking for."
					}),
					/* @__PURE__ */ jsx(Button$1, {
						asChild: true,
						variant: "outline",
						children: /* @__PURE__ */ jsx(Link, {
							to: "/products/new",
							children: "Add your first product"
						})
					})
				]
			})
		]
	}) });
});
//#endregion
//#region app/components/ui/label.tsx
function Label({ className, ...props }) {
	return /* @__PURE__ */ jsx("label", {
		"data-slot": "label",
		className: cn("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50", className),
		...props
	});
}
//#endregion
//#region app/components/ui/select.tsx
var Select$1 = Select.Root;
function SelectValue({ className, ...props }) {
	return /* @__PURE__ */ jsx(Select.Value, {
		"data-slot": "select-value",
		className: cn("flex flex-1 text-left", className),
		...props
	});
}
function SelectTrigger({ className, size = "default", children, ...props }) {
	return /* @__PURE__ */ jsxs(Select.Trigger, {
		"data-slot": "select-trigger",
		"data-size": size,
		className: cn("flex w-fit items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className),
		...props,
		children: [children, /* @__PURE__ */ jsx(Select.Icon, { render: /* @__PURE__ */ jsx(ChevronDownIcon, { className: "pointer-events-none size-4 text-muted-foreground" }) })]
	});
}
function SelectContent({ className, children, side = "bottom", sideOffset = 4, align = "center", alignOffset = 0, alignItemWithTrigger = true, ...props }) {
	return /* @__PURE__ */ jsx(Select.Portal, { children: /* @__PURE__ */ jsx(Select.Positioner, {
		side,
		sideOffset,
		align,
		alignOffset,
		alignItemWithTrigger,
		className: "isolate z-50",
		children: /* @__PURE__ */ jsxs(Select.Popup, {
			"data-slot": "select-content",
			"data-align-trigger": alignItemWithTrigger,
			className: cn("relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-36 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", className),
			...props,
			children: [
				/* @__PURE__ */ jsx(SelectScrollUpButton, {}),
				/* @__PURE__ */ jsx(Select.List, { children }),
				/* @__PURE__ */ jsx(SelectScrollDownButton, {})
			]
		})
	}) });
}
function SelectItem({ className, children, ...props }) {
	return /* @__PURE__ */ jsxs(Select.Item, {
		"data-slot": "select-item",
		className: cn("relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2", className),
		...props,
		children: [/* @__PURE__ */ jsx(Select.ItemText, {
			className: "flex flex-1 shrink-0 gap-2 whitespace-nowrap",
			children
		}), /* @__PURE__ */ jsx(Select.ItemIndicator, {
			render: /* @__PURE__ */ jsx("span", { className: "pointer-events-none absolute right-2 flex size-4 items-center justify-center" }),
			children: /* @__PURE__ */ jsx(CheckIcon, { className: "pointer-events-none" })
		})]
	});
}
function SelectScrollUpButton({ className, ...props }) {
	return /* @__PURE__ */ jsx(Select.ScrollUpArrow, {
		"data-slot": "select-scroll-up-button",
		className: cn("top-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4", className),
		...props,
		children: /* @__PURE__ */ jsx(ChevronUpIcon, {})
	});
}
function SelectScrollDownButton({ className, ...props }) {
	return /* @__PURE__ */ jsx(Select.ScrollDownArrow, {
		"data-slot": "select-scroll-down-button",
		className: cn("bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4", className),
		...props,
		children: /* @__PURE__ */ jsx(ChevronDownIcon, {})
	});
}
//#endregion
//#region app/components/SortableImage.tsx
function SortableImage({ id, url, altText, onRemove, onAltChange }) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
	return /* @__PURE__ */ jsxs("div", {
		ref: setNodeRef,
		style: {
			transform: CSS.Transform.toString(transform),
			transition,
			zIndex: isDragging ? 10 : 0,
			opacity: isDragging ? .5 : 1
		},
		className: "relative flex flex-col gap-2 rounded-lg border bg-card p-3 shadow-sm",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "group relative aspect-video overflow-hidden rounded-md bg-muted",
			children: [
				/* @__PURE__ */ jsx("img", {
					src: url,
					alt: altText,
					className: "h-full w-full object-cover"
				}),
				/* @__PURE__ */ jsx("div", {
					className: "absolute top-2 right-2 flex gap-1",
					children: /* @__PURE__ */ jsxs(Button$1, {
						type: "button",
						variant: "destructive",
						size: "icon",
						className: "h-8 w-8",
						onClick: onRemove,
						children: [/* @__PURE__ */ jsx(X, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", {
							className: "sr-only",
							children: "Remove image"
						})]
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					...attributes,
					...listeners,
					className: "absolute top-2 left-2 flex h-8 w-8 cursor-grab items-center justify-center rounded-md bg-background/80 text-muted-foreground hover:text-foreground active:cursor-grabbing",
					children: [/* @__PURE__ */ jsx(GripVertical, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", {
						className: "sr-only",
						children: "Drag to reorder"
					})]
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "grid gap-1.5",
			children: [/* @__PURE__ */ jsx(Label, {
				htmlFor: `alt-${id}`,
				className: "text-xs",
				children: "Alt Text (Mandatory)"
			}), /* @__PURE__ */ jsx(Input$1, {
				id: `alt-${id}`,
				value: altText,
				onChange: (e) => onAltChange(e.target.value),
				placeholder: "Describe the image...",
				className: "h-8 text-xs"
			})]
		})]
	});
}
//#endregion
//#region app/components/ImageDropzone.tsx
function ImageDropzone({ images, onChange }) {
	const [newUrl, setNewUrl] = React.useState("");
	const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
	const handleAddImage = () => {
		if (!newUrl) return;
		try {
			new URL(newUrl);
			onChange([...images, {
				id: crypto.randomUUID(),
				url: newUrl,
				altText: ""
			}]);
			setNewUrl("");
		} catch (e) {
			alert("Please enter a valid URL");
		}
	};
	const handleRemoveImage = (id) => {
		onChange(images.filter((img) => img.id !== id));
	};
	const handleAltChange = (id, altText) => {
		onChange(images.map((img) => img.id === id ? {
			...img,
			altText
		} : img));
	};
	const handleDragEnd = (event) => {
		const { active, over } = event;
		if (over && active.id !== over.id) onChange(arrayMove(images, images.findIndex((img) => img.id === active.id), images.findIndex((img) => img.id === over.id)));
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "space-y-2",
			children: [
				/* @__PURE__ */ jsx(Label, { children: "Product Images" }),
				/* @__PURE__ */ jsxs("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "relative flex-1",
						children: [/* @__PURE__ */ jsx(Link$1, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ jsx(Input$1, {
							type: "url",
							placeholder: "Paste image URL here...",
							className: "pl-9",
							value: newUrl,
							onChange: (e) => setNewUrl(e.target.value),
							onKeyDown: (e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									handleAddImage();
								}
							}
						})]
					}), /* @__PURE__ */ jsxs(Button$1, {
						type: "button",
						onClick: handleAddImage,
						variant: "secondary",
						children: [/* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }), "Add"]
					})]
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-[0.8rem] text-muted-foreground",
					children: "Multiple images allowed. Drag to reorder. First image will be primary."
				})
			]
		}), /* @__PURE__ */ jsx(DndContext, {
			sensors,
			collisionDetection: closestCenter,
			onDragEnd: handleDragEnd,
			children: /* @__PURE__ */ jsx(SortableContext, {
				items: images.map((img) => img.id),
				strategy: rectSortingStrategy,
				children: /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
					children: [images.map((image) => /* @__PURE__ */ jsx(SortableImage, {
						id: image.id,
						url: image.url,
						altText: image.altText,
						onRemove: () => handleRemoveImage(image.id),
						onAltChange: (val) => handleAltChange(image.id, val)
					}, image.id)), images.length === 0 && /* @__PURE__ */ jsx("div", {
						className: "col-span-full flex h-32 flex-col items-center justify-center rounded-lg border border-dashed text-muted-foreground",
						children: /* @__PURE__ */ jsx("p", { children: "No images added yet." })
					})]
				})
			})
		})]
	});
}
//#endregion
//#region app/components/ProductForm.tsx
var productSchema = z.object({
	name: z.string().min(3, "Name must be at least 3 characters").max(80, "Name must be at most 80 characters"),
	price: z.coerce.number().min(.01, "Price must be at least 0.01"),
	stockQuantity: z.coerce.number().int().min(0, "Stock must be a non-negative integer"),
	unitOfSale: z.enum(unitOfSaleEnum),
	category: z.enum(categoryEnum),
	description: z.string().min(10, "Description must be at least 10 characters").max(200, "Description must be at most 200 characters"),
	images: z.array(z.object({
		id: z.string(),
		url: z.string().url("Invalid URL"),
		altText: z.string().min(1, "Alt text is mandatory")
	})).min(1, "At least one image is required")
});
function ProductForm({ initialValues, onSubmit, isSubmitting = false, submitLabel = "Save Product" }) {
	const { register, handleSubmit, control, formState: { errors }, setValue, watch } = useForm({
		resolver: zodResolver(productSchema),
		defaultValues: {
			name: "",
			price: 0,
			stockQuantity: 0,
			unitOfSale: "stem",
			category: "roses",
			description: "",
			images: [],
			...initialValues
		}
	});
	const images = watch("images");
	return /* @__PURE__ */ jsxs("form", {
		onSubmit: handleSubmit(onSubmit),
		className: "space-y-8",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-6 md:grid-cols-2",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-2",
						children: [
							/* @__PURE__ */ jsx(Label, {
								htmlFor: "name",
								children: "Product Name"
							}),
							/* @__PURE__ */ jsx(Input$1, {
								id: "name",
								...register("name"),
								placeholder: "e.g. Red Roses",
								"aria-invalid": !!errors.name
							}),
							errors.name && /* @__PURE__ */ jsx("p", {
								className: "text-sm text-destructive",
								children: errors.name.message
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-2",
						children: [
							/* @__PURE__ */ jsx(Label, {
								htmlFor: "category",
								children: "Category"
							}),
							/* @__PURE__ */ jsx(Controller, {
								name: "category",
								control,
								render: ({ field }) => /* @__PURE__ */ jsxs(Select$1, {
									onValueChange: field.onChange,
									defaultValue: field.value,
									children: [/* @__PURE__ */ jsx(SelectTrigger, {
										id: "category",
										children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select a category" })
									}), /* @__PURE__ */ jsx(SelectContent, { children: categoryEnum.map((cat) => /* @__PURE__ */ jsx(SelectItem, {
										value: cat,
										children: cat.charAt(0).toUpperCase() + cat.slice(1)
									}, cat)) })]
								})
							}),
							errors.category && /* @__PURE__ */ jsx("p", {
								className: "text-sm text-destructive",
								children: errors.category.message
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-2",
						children: [
							/* @__PURE__ */ jsx(Label, {
								htmlFor: "price",
								children: "Price (USD)"
							}),
							/* @__PURE__ */ jsx(Input$1, {
								id: "price",
								type: "number",
								step: "0.01",
								...register("price"),
								placeholder: "0.00"
							}),
							errors.price && /* @__PURE__ */ jsx("p", {
								className: "text-sm text-destructive",
								children: errors.price.message
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-2",
						children: [
							/* @__PURE__ */ jsx(Label, {
								htmlFor: "unitOfSale",
								children: "Unit of Sale"
							}),
							/* @__PURE__ */ jsx(Controller, {
								name: "unitOfSale",
								control,
								render: ({ field }) => /* @__PURE__ */ jsxs(Select$1, {
									onValueChange: field.onChange,
									defaultValue: field.value,
									children: [/* @__PURE__ */ jsx(SelectTrigger, {
										id: "unitOfSale",
										children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select unit" })
									}), /* @__PURE__ */ jsx(SelectContent, { children: unitOfSaleEnum.map((unit) => /* @__PURE__ */ jsx(SelectItem, {
										value: unit,
										children: unit.charAt(0).toUpperCase() + unit.slice(1)
									}, unit)) })]
								})
							}),
							errors.unitOfSale && /* @__PURE__ */ jsx("p", {
								className: "text-sm text-destructive",
								children: errors.unitOfSale.message
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-2",
						children: [
							/* @__PURE__ */ jsx(Label, {
								htmlFor: "stockQuantity",
								children: "Stock Quantity"
							}),
							/* @__PURE__ */ jsx(Input$1, {
								id: "stockQuantity",
								type: "number",
								...register("stockQuantity"),
								placeholder: "0"
							}),
							errors.stockQuantity && /* @__PURE__ */ jsx("p", {
								className: "text-sm text-destructive",
								children: errors.stockQuantity.message
							})
						]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-2",
				children: [
					/* @__PURE__ */ jsx(Label, {
						htmlFor: "description",
						children: "Description"
					}),
					/* @__PURE__ */ jsx(Textarea, {
						id: "description",
						...register("description"),
						placeholder: "Describe your flower product...",
						className: "min-h-[100px]"
					}),
					errors.description && /* @__PURE__ */ jsx("p", {
						className: "text-sm text-destructive",
						children: errors.description.message
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ jsx(ImageDropzone, {
					images,
					onChange: (newImages) => setValue("images", newImages, { shouldValidate: true })
				}), errors.images && /* @__PURE__ */ jsx("p", {
					className: "text-sm text-destructive",
					children: errors.images.message
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex justify-end gap-4",
				children: /* @__PURE__ */ jsxs(Button$1, {
					type: "submit",
					disabled: isSubmitting,
					size: "lg",
					children: [isSubmitting && /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), submitLabel]
				})
			})
		]
	});
}
//#endregion
//#region app/routes/products.new.tsx
var products_new_exports = /* @__PURE__ */ __exportAll({
	action: () => action$1,
	default: () => products_new_default
});
async function action$1({ request }) {
	const formData = await request.formData();
	const rawData = JSON.parse(formData.get("data"));
	try {
		const data = await productSchema.refine(async (data) => await ProductService.checkNameUniqueness(data.name), {
			message: "Product name must be unique",
			path: ["name"]
		}).parseAsync(rawData);
		const productData = {
			id: crypto.randomUUID(),
			name: data.name,
			priceCents: Math.round(data.price * 100),
			stockQuantity: data.stockQuantity,
			unitOfSale: data.unitOfSale,
			category: data.category,
			description: data.description
		};
		const imagesData = data.images.map((img, index) => ({
			id: crypto.randomUUID(),
			url: img.url,
			altText: img.altText,
			displayOrder: index
		}));
		await ProductService.createProduct(productData, imagesData);
		return redirect("/");
	} catch (error) {
		if (error.name === "ZodError") return { error: error.errors[0].message };
		return { error: error.message || "Failed to create product" };
	}
}
var products_new_default = UNSAFE_withComponentProps(function NewProductPage() {
	const submit = useSubmit();
	const isSubmitting = useNavigation().state === "submitting";
	const handleSubmit = (values) => {
		submit({ data: JSON.stringify(values) }, { method: "post" });
	};
	return /* @__PURE__ */ jsx(MainLayout, { children: /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-4xl py-8",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mb-8",
			children: [/* @__PURE__ */ jsx("h1", {
				className: "text-3xl font-bold tracking-tight",
				children: "Create New Product"
			}), /* @__PURE__ */ jsx("p", {
				className: "text-muted-foreground",
				children: "Add a new flower product to the catalog."
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "rounded-xl border bg-card p-6 shadow-sm",
			children: /* @__PURE__ */ jsx(ProductForm, {
				onSubmit: handleSubmit,
				isSubmitting,
				submitLabel: "Create Product"
			})
		})]
	}) });
});
//#endregion
//#region app/routes/products.edit.tsx
var products_edit_exports = /* @__PURE__ */ __exportAll({
	action: () => action,
	default: () => products_edit_default,
	loader: () => loader
});
async function loader({ params }) {
	const { id } = params;
	if (!id) throw new Error("Product ID is required");
	const product = await ProductService.getProductById(id);
	if (!product) throw new Response("Product Not Found", { status: 404 });
	return { product };
}
async function action({ request, params }) {
	const { id } = params;
	if (!id) throw new Error("Product ID is required");
	const formData = await request.formData();
	const rawData = JSON.parse(formData.get("data"));
	try {
		const data = await productSchema.refine(async (data) => await ProductService.checkNameUniqueness(data.name, id), {
			message: "Product name must be unique",
			path: ["name"]
		}).parseAsync(rawData);
		const productData = {
			name: data.name,
			priceCents: Math.round(data.price * 100),
			stockQuantity: data.stockQuantity,
			unitOfSale: data.unitOfSale,
			category: data.category,
			description: data.description
		};
		const imagesData = data.images.map((img, index) => ({
			id: img.id.startsWith("new-") ? crypto.randomUUID() : img.id,
			url: img.url,
			altText: img.altText,
			displayOrder: index
		}));
		await ProductService.updateProduct(id, productData, imagesData);
		return redirect("/");
	} catch (error) {
		if (error.name === "ZodError") return { error: error.errors[0].message };
		return { error: error.message || "Failed to update product" };
	}
}
var products_edit_default = UNSAFE_withComponentProps(function EditProductPage() {
	const { product } = useLoaderData();
	const submit = useSubmit();
	const isSubmitting = useNavigation().state === "submitting";
	const handleSubmit = (values) => {
		submit({ data: JSON.stringify(values) }, { method: "post" });
	};
	const initialValues = {
		name: product.name,
		price: product.priceCents / 100,
		stockQuantity: product.stockQuantity,
		unitOfSale: product.unitOfSale,
		category: product.category,
		description: product.description,
		images: product.images.map((img) => ({
			id: img.id,
			url: img.url,
			altText: img.altText
		})).sort((a, b) => {
			const imgA = product.images.find((i) => i.id === a.id);
			const imgB = product.images.find((i) => i.id === b.id);
			return (imgA?.displayOrder || 0) - (imgB?.displayOrder || 0);
		})
	};
	return /* @__PURE__ */ jsx(MainLayout, { children: /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-4xl py-8",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mb-8",
			children: [/* @__PURE__ */ jsx("h1", {
				className: "text-3xl font-bold tracking-tight",
				children: "Edit Product"
			}), /* @__PURE__ */ jsxs("p", {
				className: "text-muted-foreground",
				children: [
					"Update the details for \"",
					product.name,
					"\"."
				]
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "rounded-xl border bg-card p-6 shadow-sm",
			children: /* @__PURE__ */ jsx(ProductForm, {
				initialValues,
				onSubmit: handleSubmit,
				isSubmitting,
				submitLabel: "Update Product"
			})
		})]
	}) });
});
//#endregion
//#region \0virtual:react-router/server-manifest
var server_manifest_default = {
	"entry": {
		"module": "/assets/entry.client-BfWWPDmn.js",
		"imports": ["/assets/jsx-runtime-CKY8lHhi.js"],
		"css": []
	},
	"routes": {
		"root": {
			"id": "root",
			"parentId": void 0,
			"path": "",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/root-tbhuLkGi.js",
			"imports": ["/assets/jsx-runtime-CKY8lHhi.js", "/assets/dist-CB6TYzEi.js"],
			"css": ["/assets/root-N8K1rOzS.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/home": {
			"id": "routes/home",
			"parentId": "root",
			"path": void 0,
			"index": true,
			"caseSensitive": void 0,
			"hasAction": true,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/home-dRjYYKJh.js",
			"imports": [
				"/assets/jsx-runtime-CKY8lHhi.js",
				"/assets/schema-BhQtpOZA.js",
				"/assets/dist-CB6TYzEi.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/products.new": {
			"id": "routes/products.new",
			"parentId": "root",
			"path": "products/new",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": true,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/products.new-pjrZs20a.js",
			"imports": [
				"/assets/jsx-runtime-CKY8lHhi.js",
				"/assets/ProductForm-CCsUpjhM.js",
				"/assets/schema-BhQtpOZA.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/products.edit": {
			"id": "routes/products.edit",
			"parentId": "root",
			"path": "products/:id/edit",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": true,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/products.edit-Djgn8L7n.js",
			"imports": [
				"/assets/jsx-runtime-CKY8lHhi.js",
				"/assets/ProductForm-CCsUpjhM.js",
				"/assets/schema-BhQtpOZA.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		}
	},
	"url": "/assets/manifest-3f2fad13.js",
	"version": "3f2fad13",
	"sri": void 0
};
//#endregion
//#region \0virtual:react-router/server-build
var assetsBuildDirectory = "build/client";
var basename = "/";
var future = {
	"unstable_optimizeDeps": false,
	"v8_passThroughRequests": false,
	"unstable_trailingSlashAwareDataRequests": false,
	"unstable_previewServerPrerendering": false,
	"v8_middleware": false,
	"v8_splitRouteModules": false,
	"v8_viteEnvironmentApi": false
};
var ssr = true;
var isSpaMode = false;
var prerender = [];
var routeDiscovery = {
	"mode": "lazy",
	"manifestPath": "/__manifest"
};
var publicPath = "/";
var entry = { module: entry_server_node_exports };
var routes = {
	"root": {
		id: "root",
		parentId: void 0,
		path: "",
		index: void 0,
		caseSensitive: void 0,
		module: root_exports
	},
	"routes/home": {
		id: "routes/home",
		parentId: "root",
		path: void 0,
		index: true,
		caseSensitive: void 0,
		module: home_exports
	},
	"routes/products.new": {
		id: "routes/products.new",
		parentId: "root",
		path: "products/new",
		index: void 0,
		caseSensitive: void 0,
		module: products_new_exports
	},
	"routes/products.edit": {
		id: "routes/products.edit",
		parentId: "root",
		path: "products/:id/edit",
		index: void 0,
		caseSensitive: void 0,
		module: products_edit_exports
	}
};
var allowedActionOrigins = false;
//#endregion
export { allowedActionOrigins, server_manifest_default as assets, assetsBuildDirectory, basename, entry, future, isSpaMode, prerender, publicPath, routeDiscovery, routes, ssr };
