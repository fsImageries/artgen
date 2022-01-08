import React, {useState} from 'react'

const SettingsMenu = ({children}:any) => {
    const [settingsOpen, setSettingsOpen] = useState(false);

    return (
        <>
         <div className="settingsBtn" onClick={() => setSettingsOpen((v) => !v)}>
        <i className="fas fa-cog"></i>
      </div>

      <div className={`settingsHolder ${settingsOpen ? "" : "hidden"}`}>
        <div className="inner">
          {/* <div className="header">Flow Field Settings</div> */}

        {children}
        </div>
      </div>
        </>
    )
}

export default SettingsMenu
