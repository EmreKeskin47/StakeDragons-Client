const fullHeightPages = ['/inventory/dragon', '/inventory/egg', '/crystal-inventory', '/market', '/stake']

export const isFullHeightPage = (page) => {
    return fullHeightPages.includes(page);
}

export const getDrawerProps = (page) => {
    if (isFullHeightPage(page)) {
        return {
            height: '100vh',
            position: 'fixed',
            top: 0,
            left: 0
        }
    }

    return {}
}

export const getContainerProps = ({ page, bg, drawerOpen, drawerWidth }) => {
    if (isFullHeightPage(page)) {
        return {
            flexGrow: 1,
            width: drawerOpen ? `calc(100% - 200px)` : '100%',
            minHeight: 'calc(100vh - 150px)',
            backgroundImage: `url(${bg})`,
            paddingLeft: `${drawerWidth + (drawerOpen ? 24 : 0)}px`,
            backgroundAttachment: 'fixed',
        }
    }

    return {
        flexGrow: 1,
        width: drawerOpen ? `calc(100% - 200px)` : '100%',
        backgroundImage: `url(${bg})`,
    }
}