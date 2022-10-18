import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet-async'

import { Grid } from '../components'

export function ContractsPage() {
    return (
        <>
            <Helmet>
                <title>Contrats - Former22</title>
            </Helmet>
        </>
    )
}
