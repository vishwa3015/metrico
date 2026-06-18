import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/apiClient'

export interface FacilityOption {
    facility_id:   string
    facility_name: string
}

export function useFacilities() {
    const [facilities, setFacilities] = useState<FacilityOption[]>([])

    useEffect(() => {
        apiClient.get('/facilities')
            .then(res => setFacilities(res.data.data.facilities ?? []))
            .catch(err => console.error('[useFacilities]', err))
    }, [])

    return facilities
}