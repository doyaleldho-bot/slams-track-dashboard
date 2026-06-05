import React, { useState } from "react"

import Profile from "../components/settings/Profile"
import UnderMain from "../components/UnderMain"
import Security from "../components/settings/Security"

const settingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Profile")

  const tabs = ["Profile", "Finance", "Security"]
  return (
    <div className="p-6">
      <div className="flex flex-col gap-4">
        <h1 className="font-poppins text-[24px] font-semibold leading-[16px] tracking-[0.08em] text-[#2F2F2F]">
          Settings
        </h1>
        <span className="font-poppins text-[16px] font-normal leading-[24px] tracking-[0.08em] text-[#767676]">
          Settings page manages reset password, admin profile, academic rules,
          finance rules, roles & permissions, notifications, and system
          configuration.
        </span>
      </div>
      {/* Tabs */}

      <div className="relative mt-10  flex h-[35px] w-full max-w-[712px] rounded-[15px] bg-white border border-[#00000000] p-[2px]">
        {/* Sliding Background */}
        <div
          className={`absolute top-[2px] left-[2px] h-[calc(100%-4px)] w-[calc((100%-4px)/3)]
      rounded-[13px] bg-[#474747]
      transition-all duration-300 ease-in-out`}
          style={{
            transform: `translateX(${
              activeTab === "Profile"
                ? "0%"
                : activeTab === "Finance"
                  ? "100%"
                  : "200%"
            })`,
          }}
        />

        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative z-10 flex-1 text-[14px] font-medium transition-colors duration-300
        ${activeTab === tab ? "text-white" : "text-[#474747]"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-10 flex items-center justify-center">
        {activeTab === "Profile" && <Profile />}

        {activeTab === "Finance" && <UnderMain />}

        {activeTab === "Security" && <Security />}
      </div>
    </div>
  )
}

export default settingPage
