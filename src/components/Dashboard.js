import React from 'react'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import { AllJobs, EditJob } from '.'
import { useRememberedState } from '../hooks'

export const Dashboard = props => {
  const [defaultIndex, setDefaultIndex] = useRememberedState(0)

  return <main>
    <Tabs defaultIndex={defaultIndex} forceRenderTabPanel className='m-2 md:m-8 overflow-y-scroll max-h-full'>
      <TabList>
        <Tab onClick={e => setDefaultIndex(0)}>Existing Jobs</Tab>
        <Tab onClick={e => setDefaultIndex(1)}>Create A Job</Tab>
      </TabList>
      <TabPanel>
        <AllJobs />
      </TabPanel>
      <TabPanel>
        <EditJob />
      </TabPanel>
    </Tabs>
  </main>
}
