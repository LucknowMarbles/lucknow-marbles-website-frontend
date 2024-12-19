import React, { useState } from 'react'
import AgGridUI from './AgGridUI'
import { Button, Group, ActionIcon, Stack, Paper } from '@mantine/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faColumns, faXmark } from '@fortawesome/free-solid-svg-icons'

export default function AgGridContainer({ url }) {
  const [splitViews, setSplitViews] = useState([{ id: 1, url }])

  function handleAddSplitView(newUrl = url) {
    setSplitViews(prev => [...prev, {
      id: prev.length + 1,
      url: newUrl
    }])
  }

  function handleCloseView(id) {
    setSplitViews(prev => prev.filter(view => view.id !== id))
  }

  return (
    <div style={{
      display: 'flex',
      gap: '1rem',
      height: 'calc(100vh - 140px)'
    }}>
      {splitViews.map((view) => (
        <Stack key={view.id} style={{ flex: 1, minWidth: 0 }} spacing="xs">
          {splitViews.length > 1 && (
            <Paper
              shadow="sm"
              p="xs"
              withBorder
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                backgroundColor: 'var(--mantine-color-gray-0)'
              }}
            >
              <ActionIcon
                variant="light"
                color="blue"
                size="sm"
                onClick={() => handleCloseView(view.id)}
              >
                <FontAwesomeIcon icon={faXmark} />
              </ActionIcon>
            </Paper>
          )}
          <div style={{ flex: 1, minHeight: 0 }}>
            <AgGridUI
              url={view.url}
              onButtonClick={(newUrl) => handleAddSplitView(newUrl)}
            />
          </div>
        </Stack>
      ))}
    </div>
  )
}
