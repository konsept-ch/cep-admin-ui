import { useState, useMemo } from 'react'

import { Grid, CourseDetailsModal, EditBtnCellRenderer, EditCourseModal } from '../components'
import { formatDate } from '../utils'
import { Helmet } from 'react-helmet-async'
import { useGetAdminsQuery } from '../services/admins'
import { useGetCoursesQuery } from '../services/courses'

export function CoursesPage() {
    const [selectedCourseData, setSelectedCourseData] = useState(null)

    const {
        data: courses,
        isFetching,
        refetch: refetchCourses,
    } = useGetCoursesQuery(null, { refetchOnMountOrArgChange: true })

    const { data: adminsData, error, isLoading } = useGetAdminsQuery(null, { refetchOnMountOrArgChange: true })

    const admins = adminsData?.map((admin) => ({ value: admin.id, label: `${admin.first_name} ${admin.last_name}` }))

    const openCourseEditModal = ({ data }) => {
        // workaround - passes a new object to trigger reopen when the same row is clicked
        setSelectedCourseData({ ...data })
    }

    const columnDefs = [
        {
            field: 'edit',
            headerName: '',
            cellRenderer: 'btnCellRenderer',
            headerTooltip: 'Modifier la formation',
            cellClass: 'edit-column',
            pinned: 'left',
            maxWidth: 60,
            filter: false,
            sortable: false,
        },
        {
            field: 'name',
            headerName: 'Titre de la formation',
            filter: 'agTextColumnFilter',
            headerTooltip: 'Le nom de la formation',
            onCellDoubleClicked: ({ data }) => setSelectedCourseId(data.id),
            width: 400,
        },
        {
            field: 'code',
            headerName: 'Code',
            filter: 'agTextColumnFilter',
            headerTooltip: 'Le code de la formation',
            width: 200,
        },
        {
            field: 'duration',
            headerName: 'Durée',
            filter: 'agNumberColumnFilter',
            headerTooltip: 'La durée de la formation',
            width: 100,
            type: 'numericColumn',
        },
        {
            field: 'price',
            headerName: 'Coût',
            filter: 'agNumberColumnFilter',
            headerTooltip: 'Le prix de la formation',
            width: 100,
            type: 'numericColumn',
            // TODO format "CHF 1234"
        },
        {
            field: 'coordinator',
            headerName: 'CF (coordinateur)',
            filter: 'agTextColumnFilter',
            headerTooltip: 'Le coordinateur de la formation',
            width: 170,
        },
        {
            field: 'responsible',
            headerName: 'RF (responsable)',
            filter: 'agTextColumnFilter',
            headerTooltip: 'Le responsable de la formation',
            width: 170,
        },

        {
            field: 'typeStage',
            headerName: 'Type stage',
            filter: 'agTextColumnFilter',
            headerTooltip: 'Le type stage',
            width: 120,
        },
        {
            field: 'teachingMethod',
            headerName: 'Méthode enseignement',
            filter: 'agTextColumnFilter',
            headerTooltip: 'La méthode pédagogique',
            width: 210,
        },
        {
            field: 'codeCategory',
            headerName: 'Code catégorie',
            filter: 'agTextColumnFilter',
            headerTooltip: 'Le code catégorie',
            width: 150,
        },
        {
            field: 'hidden',
            headerName: 'Visibilité',
            filter: 'agSetColumnFilter',
            headerTooltip: 'Si la formation est cachée',
            valueGetter: ({ data: { hidden } }) => (hidden ? 'Cachée' : 'Visible'),
            width: 120,
        },
        {
            field: 'creationDate',
            headerName: 'Date de création',
            filter: 'agDateColumnFilter',
            headerTooltip: 'La date de création de la formation',
            valueFormatter: ({ value }) => formatDate({ dateString: value, isDateVisible: true }),
            type: 'numericColumn',
        },
        {
            field: 'lastModifiedDate',
            headerName: 'Dernière modification',
            filter: 'agDateColumnFilter',
            headerTooltip: 'La date de la dernière modification',
            valueFormatter: ({ value }) => formatDate({ dateString: value, isDateVisible: true }),
            type: 'numericColumn',
        },
        {
            field: 'theme',
            headerName: 'Thème',
            filter: 'agTextColumnFilter',
            headerTooltip: 'Le thème de la formation',
        },
        {
            field: 'targetAudience',
            headerName: 'Public cible',
            filter: 'agTextColumnFilter',
            headerTooltip: 'Le public cible',
        },
        {
            field: 'billingMode',
            headerName: 'Mode de facturation',
            filter: 'agSetColumnFilter',
            headerTooltip: 'Le mode de facturation',
        },
        {
            field: 'pricingType',
            headerName: 'Tarification',
            filter: 'agSetColumnFilter',
            headerTooltip: 'La tarification de la formation',
        },
        {
            field: 'baseRate',
            headerName: 'Tarif de base',
            filter: 'agNumberColumnFilter',
            headerTooltip: 'La tarification de la formation',
            type: 'numericColumn',
        },
        {
            field: 'isRecurrent',
            headerName: 'Formation Récurrente',
            filter: 'agSetColumnFilter',
            headerTooltip: 'Si la formation est récurrente',
            valueGetter: ({ data: { isRecurrent } }) => (isRecurrent ? 'Oui' : 'Non'),
        },
    ]

    const rowData = useMemo(
        () =>
            courses?.map(
                ({
                    id,
                    name,
                    code,
                    restrictions: { hidden },
                    price,
                    meta: { created, updated, duration },
                    coordinator,
                    responsible,
                    typeStage,
                    teachingMethod,
                    codeCategory,
                    theme,
                    targetAudience,
                    billingMode,
                    pricingType,
                    baseRate,
                }) => ({
                    id,
                    name,
                    code,
                    duration,
                    price,
                    coordinator,
                    responsible,
                    creationDate: created,
                    lastModifiedDate: updated,
                    hidden,
                    typeStage,
                    teachingMethod,
                    codeCategory,
                    theme,
                    targetAudience,
                    billingMode,
                    pricingType,
                    baseRate,
                })
            ),
        [courses]
    )

    const [selectedCourseId, setSelectedCourseId] = useState()

    return (
        <>
            <Helmet>
                <title>Formations - Former22</title>
            </Helmet>
            <EditCourseModal
                refetchCourses={refetchCourses}
                selectedCourseData={selectedCourseData}
                adminsData={admins}
            />
            <Grid
                {...{
                    name: 'Formations',
                    columnDefs,
                    rowData,
                    components: { btnCellRenderer: EditBtnCellRenderer({ onClick: openCourseEditModal }) },
                    isDataLoading: isFetching,
                }}
            />

            {typeof selectedCourseId !== 'undefined' ? (
                <CourseDetailsModal
                    closeModal={() => setSelectedCourseId()}
                    courseDetailsData={courses.find(({ id }) => id === selectedCourseId)}
                    onAfterSave={refetchCourses}
                />
            ) : null}
        </>
    )
}
