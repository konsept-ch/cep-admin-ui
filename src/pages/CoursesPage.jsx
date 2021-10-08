import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Grid } from '../components'
import { fetchCoursesAction } from '../actions/courses.ts'
import { coursesSelector } from '../reducers'

export function CoursesPage() {
    const dispatch = useDispatch()
    const courses = useSelector(coursesSelector)

    useEffect(() => {
        dispatch(fetchCoursesAction())
    }, [])

    const columnDefs = [
        {
            field: 'name',
            headerName: 'Titre de la formation',
            filter: 'agTextColumnFilter',
            headerTooltip: 'Le nom de la formation',
        },
        {
            field: 'code',
            headerName: 'Code',
            filter: 'agTextColumnFilter',
            headerTooltip: 'Le code de la formation',
        },
        {
            field: 'duration',
            headerName: 'Durée',
            filter: 'agNumberColumnFilter',
            headerTooltip: 'La durée de la formation',
        },
        {
            field: 'price',
            headerName: 'Coût',
            filter: 'agNumberColumnFilter',
            headerTooltip: 'Le prix de la formation',
        },
        // {
        //     field: 'coordinator',
        //     headerName: 'CF (coordinateur de formation)',
        //     filter: 'agTextColumnFilter',
        //     headerTooltip: 'Le coordinateur de la formation',
        // },
        // {
        //     field: 'responsible',
        //     headerName: 'RF (responsable de formation)',
        //     filter: 'agTextColumnFilter',
        //     headerTooltip: 'Le responsable de la formation',
        // },
        {
            field: 'creationDate',
            headerName: 'Date de création',
            filter: 'agDateColumnFilter',
            headerTooltip: 'La date de création de la formation',
        },
        {
            field: 'lastModifiedDate',
            headerName: 'Dernière modification',
            filter: 'agDateColumnFilter',
            headerTooltip: 'La date de la dernière modification',
        },
        {
            field: 'hidden',
            headerName: 'Visibilité',
            filter: 'agSetColumnFilter',
            headerTooltip: 'Est-ce que la formation est cachée',
            valueGetter: ({ data: { hidden } }) => (hidden ? 'Cachée' : 'Visible'),
        },
    ]

    const rowData = courses?.map(
        ({
            name,
            code,
            restrictions: { hidden },
            pricing: { price },
            meta: { created, updated, duration },
            // coordinator,
            // responsible,
        }) => ({
            name,
            code,
            duration,
            price,
            // coordinator: coordinator,
            // responsible: responsible,
            creationDate: created,
            lastModifiedDate: updated,
            hidden,
        })
    )

    return <Grid name="Courses" columnDefs={columnDefs} rowData={rowData} />
}
