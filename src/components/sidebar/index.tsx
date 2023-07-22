import styles from './sidebar.module.css'

export default function Sidebar({children}: {children: any}) {

    return(
        <div className={styles.sidebarContainer}>
            <div className={styles.sidebar}>
            <h2>Files</h2>
            {children}
        </div>
        </div>
    )
}