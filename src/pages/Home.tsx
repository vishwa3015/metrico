import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Button, Modal, Table, Dropdown } from '@/components/ui'

const Home = () => {
  const logout = useAuthStore(state => state.logout)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selected, setSelected] = useState('')

  const columns = [
    { key: 'name' as const, label: 'Name' },
    { key: 'role' as const, label: 'Role' },
    { key: 'status' as const, label: 'Status' },
  ]

  const data = [
    { name: 'dummy', role: 'Developer', status: 'Active' },
    { name: 'John', role: 'Designer', status: 'Inactive' },
  ]

  const options = [
    { label: 'Developer', value: 'dev' },
    { label: 'Designer', value: 'design' },
    { label: 'Manager', value: 'manager' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Metrico Dashboard</h1>
        <Button label="Logout" onClick={logout} variant="secondary" />
      </div>
      <div className="flex">
        <Dropdown
          options={options}
          value={selected}
          onChange={setSelected}
          label="Filter by Role"
        />
      </div>
      <Table columns={columns} data={data} />

      <div className="flex">
        <Button label="Open Modal" onClick={() => setIsModalOpen(true)} />
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Test Modal"
        footer={<Button label="Close" onClick={() => setIsModalOpen(false)} variant="secondary" />}
      >
        <p>All base components are working!</p>
      </Modal>
    </div>
  )
}

export default Home
