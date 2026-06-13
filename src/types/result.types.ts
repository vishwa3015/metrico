export type TestType = 'HOCl' | 'pH'

export type ResultStatus = 'Within Range' | 'Below Range' | 'Above Range' | 'Invalid Reading'

export type SyncStatus = 'Synced' | 'Pending Sync' | 'Sync Failed'

export type SortBy =
    | 'tested_at'
    | 'test_type'
    | 'result_status'
    | 'user_name_snapshot'
    | 'device_id'

export type SortOrder = 'ASC' | 'DESC'

export interface TestResult {
    result_id: string
    tested_at: string
    test_type: TestType
    user_id: string
    estimated_value: string | null
    unit: string
    detected_color_hex: string
    detected_color_hex_yellow: string | null
    detected_color_hex_blue: string | null
    detected_color_label: string | null
    accepted_min_value: string
    accepted_max_value: string
    result_status: ResultStatus
    user_name_snapshot: string
    device_id: string
    device_name_snapshot: string
    sync_status: SyncStatus
    retest_of_result_id: string | null
}

export interface TestResultDetail extends TestResult {
    organization_id: string
    facility_id: string
    user_id: string
    user_role_snapshot: string
    device_serial_snapshot: string
    cartridge_type: TestType
    notes_from_mobile: string | null
    synced_at: string
    created_at: string
}

export interface ResultFilters {
    date_from?: string
    date_to?: string
    facility_id?: string
    user_id?: string
    device_id?: string
    test_type?: TestType | ''
    result_status?: ResultStatus | ''
    sync_status?: SyncStatus | ''
    sort_by?: SortBy
    sort_order?: SortOrder
    page?: number
    page_size?: number
}

export interface Pagination {
    total: number
    page: number
    page_size: number
    total_pages: number
}

export interface ResultsResponse {
    data: TestResult[]
    pagination: Pagination
}