import { RangeStatus } from "@/components/common/data"

export interface ApiTestResult {
    result_id: string
    tested_at: string
    test_type: 'HOCl' | 'pH'
    estimated_value: string | null
    unit: string
    detected_color_hex: string
    detected_color_hex_2: string | null
    detected_color_label: string
    accepted_min_value: string
    accepted_max_value: string
    result_status: 'Within Range' | 'Below Range' | 'Above Range' | 'Invalid Reading' | 'Needs Attention'
    notes_from_mobile: string | null
    sync_status: string
    user_id: string | null
    user_name_snapshot: string | null
    user_role_snapshot: string | null
    device_id: string | null
    device_name_snapshot: string | null
    device_serial_snapshot: string | null
    retest_of_result_id: string | null
    user?: {
        user_id: string
        first_name: string
        last_name: string
        email: string
        role: string
    } | null
    device?: {
        device_id: string
        device_name: string
        serial_number: string
        connection_status: string
        status: string
    } | null
    facility?: {
        facility_id: string
        facility_name: string
    } | null
}

export interface ResultsResponse {
    results: ApiTestResult[]
    pagination: {
        total: number
        page: number
        limit: number
        total_pages: number
        has_next: boolean
        has_prev: boolean
    }
}

export interface ResultsParams {
    page?: number
    limit?: number
    facility_id?: string
    user_id?: string
    device_id?: string
    test_type?: 'HOCl' | 'pH'
    result_status?: string
    sync_status?: string
    date_from?: string
    date_to?: string
    search?: string
    sort_by?: string
    sort_order?: 'ASC' | 'DESC'
}


export type DetailPanelResult = {
  id: string
  timestamp: string
  operator: string
  operatorRole: string
  site: string
  organization: string
  device: string
  cartridgeType: string
  hocl: number | null
  hoclYellow: string
  hoclBlue: string
  ph: number | null
  phColor: string
  phStatus: RangeStatus
  notes: string | null
}