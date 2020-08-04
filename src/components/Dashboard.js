import React, { useState } from 'react'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import { AllJobs, EditJob } from '.'
import { useRememberedState } from '../hooks'

export const Dashboard = props => {
  const [defaultIndex, setDefaultIndex] = useRememberedState(0)
  const [totalJobs, setTotalJobs] = useState(0)

  return <main>
    <Tabs defaultIndex={defaultIndex} forceRenderTabPanel className='m-2 md:m-8 overflow-y-scroll max-h-full'>
      <TabList>
        <Tab onClick={e => setDefaultIndex(0)}>
          Existing Jobs
          {totalJobs
            ? <span className='rounded-full bg-blue-500 text-white inline-flex justify-center px-2 ml-2'>
              {totalJobs}
            </span>
            : null}
        </Tab>
        <Tab onClick={e => setDefaultIndex(1)}>Create A Job</Tab>
      </TabList>
      <TabPanel>
        <AllJobs setJobs={setTotalJobs} />
      </TabPanel>
      <TabPanel>
        <EditJob />
      </TabPanel>
    </Tabs>
  </main>
}
