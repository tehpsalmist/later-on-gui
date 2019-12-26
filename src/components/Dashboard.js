import React from 'react'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import { AllJobs } from '.'

export const Dashboard = props => {
  return <main>
    <Tabs className='m-2 md:m-8'>
      <TabList>
        <Tab>Create A Job</Tab>
        <Tab>Existing Jobs</Tab>
      </TabList>
      <TabPanel>
        <p>we gon create one yo</p>
      </TabPanel>
      <TabPanel>
        <AllJobs />
      </TabPanel>
    </Tabs>
  </main>
}
