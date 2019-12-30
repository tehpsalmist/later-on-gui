import React, { useState } from 'react'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import { AllJobs, NewJob } from '.'

export const Dashboard = props => {
  return <main>
    <Tabs defaultIndex={1} forceRenderTabPanel className='m-2 md:m-8 overflow-y-scroll max-h-full'>
      <TabList>
        <Tab>Existing Jobs</Tab>
        <Tab>Create A Job</Tab>
      </TabList>
      <TabPanel>
        <AllJobs />
      </TabPanel>
      <TabPanel>
        <NewJob />
      </TabPanel>
    </Tabs>
  </main>
}
