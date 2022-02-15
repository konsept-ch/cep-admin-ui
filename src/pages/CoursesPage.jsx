import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Grid, CourseDetailsModal } from '../components'
import { fetchCoursesAction, updateCourseAction } from '../actions/courses.ts'
import { fetchAdminsAction } from '../actions/users.ts'
import { coursesSelector, adminsSelector } from '../reducers'
import { formatDate } from '../utils'
import { Helmet } from 'react-helmet-async'

export function CoursesPage() {
    const dispatch = useDispatch()
    const courses = useSelector(coursesSelector)
    const admins = useSelector(adminsSelector)?.map((admin) => admin.name)
    const fetchCourses = useCallback(() => dispatch(fetchCoursesAction()), [dispatch])
    const fetchAdmins = useCallback(() => dispatch(fetchAdminsAction()), [dispatch])
    const updateCourse = useCallback(
        ({ courseId, field, newValue, header }) => dispatch(updateCourseAction({ courseId, field, newValue, header })),
        [dispatch]
    )

    useEffect(() => {
        fetchCourses()
        fetchAdmins()
    }, [fetchCourses, fetchAdmins])

    const typeStageValues = ['Attestation', 'Certificat', 'Autre']
    const teachingMethodValues = ['Présentiel', 'Distanciel', 'E-learning', 'Mixte/Blended']
    const codeCategoryValues = ['Catalogue', 'FSM', 'PS', 'CIE', 'CAS']

    const columnDefs = [
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
            editable: true,
            cellEditor: 'agRichSelectCellEditor',
            cellEditorParams: { values: admins },
            onCellValueChanged: (data) =>
                updateCourse({
                    courseId: data.data.id,
                    field: data.colDef.field,
                    header: data.colDef.headerName,
                    newValue: data.newValue,
                }),
            width: 170,
        },
        {
            field: 'responsible',
            headerName: 'RF (responsable)',
            filter: 'agTextColumnFilter',
            headerTooltip: 'Le responsable de la formation',
            editable: true,
            cellEditor: 'agRichSelectCellEditor',
            cellEditorParams: { values: admins },
            onCellValueChanged: (data) =>
                updateCourse({
                    courseId: data.data.id,
                    field: data.colDef.field,
                    header: data.colDef.headerName,
                    newValue: data.newValue,
                }),
            width: 170,
        },

        {
            field: 'typeStage',
            headerName: 'Type stage',
            filter: 'agTextColumnFilter',
            editable: true,
            headerTooltip: 'Le type stage',
            cellEditor: 'agRichSelectCellEditor',
            cellEditorParams: { values: typeStageValues },
            onCellValueChanged: (data) =>
                updateCourse({
                    courseId: data.data.id,
                    field: data.colDef.field,
                    header: data.colDef.headerName,
                    newValue: data.newValue,
                }),
            width: 120,
        },
        {
            field: 'teachingMethod',
            headerName: 'Méthode enseignement',
            filter: 'agTextColumnFilter',
            editable: true,
            headerTooltip: 'La méthode pédagogique',
            cellEditor: 'agRichSelectCellEditor',
            cellEditorParams: { values: teachingMethodValues },
            onCellValueChanged: (data) =>
                updateCourse({
                    courseId: data.data.id,
                    field: data.colDef.field,
                    header: data.colDef.headerName,
                    newValue: data.newValue,
                }),
            width: 210,
        },
        {
            field: 'codeCategory',
            headerName: 'Code catégorie',
            filter: 'agTextColumnFilter',
            editable: true,
            headerTooltip: 'Le code catégorie',
            cellEditor: 'agRichSelectCellEditor',
            cellEditorParams: { values: codeCategoryValues },
            onCellValueChanged: (data) =>
                updateCourse({
                    courseId: data.data.id,
                    field: data.colDef.field,
                    header: data.colDef.headerName,
                    newValue: data.newValue,
                }),
            width: 150,
        },
        {
            field: 'hidden',
            headerName: 'Visibilité',
            filter: 'agSetColumnFilter',
            headerTooltip: 'Est-ce que la formation est cachée',
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
    ]

    const rowData = courses?.map(
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
        })
    )

    const [selectedCourseId, setSelectedCourseId] = useState()

    return (
        <>
            <Helmet>
                <title>Formations - Former22</title>
            </Helmet>
            <Grid
                {...{
                    name: 'Formations',
                    columnDefs,
                    rowData,
                }}
            />

            {typeof selectedCourseId !== 'undefined' ? (
                <CourseDetailsModal
                    closeModal={() => setSelectedCourseId()}
                    courseDetailsData={courses.find(({ id }) => id === selectedCourseId)}
                    onAfterSave={fetchCourses}
                />
            ) : null}
        </>
    )
}
