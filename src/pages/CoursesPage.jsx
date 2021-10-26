import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Grid, CourseDetailsModal } from '../components'
import { fetchCoursesAction, updateCourseAction } from '../actions/courses.ts'
import { fetchAdminsAction } from '../actions/users.ts'
import { coursesSelector, adminsSelector } from '../reducers'

export function CoursesPage() {
    const dispatch = useDispatch()
    const courses = useSelector(coursesSelector)
    const admins = useSelector(adminsSelector).map((admin) => admin.name)
    const fetchCourses = useCallback(() => dispatch(fetchCoursesAction()), [dispatch])
    const fetchAdmins = useCallback(() => dispatch(fetchAdminsAction()), [dispatch])
    const updateCourse = useCallback(
        ({ courseId, field, newValue }) => dispatch(updateCourseAction({ courseId, field, newValue })),
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
        {
            field: 'cordinator',
            headerName: 'CF (coordinateur de formation)',
            filter: 'agTextColumnFilter',
            headerTooltip: 'Le coordinateur de la formation',
            editable: true,
            cellEditor: 'agRichSelectCellEditor',
            cellEditorParams: { values: admins },
            onCellValueChanged: (data) =>
                updateCourse({ courseId: data.data.id, field: data.colDef.field, newValue: data.newValue }),
        },
        {
            field: 'responsible',
            headerName: 'RF (responsable de formation)',
            filter: 'agTextColumnFilter',
            headerTooltip: 'Le responsable de la formation',
            editable: true,
            cellEditor: 'agRichSelectCellEditor',
            cellEditorParams: { values: admins },
            onCellValueChanged: (data) =>
                updateCourse({ courseId: data.data.id, field: data.colDef.field, newValue: data.newValue }),
        },
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
        {
            field: 'typeStage',
            headerName: 'Type stage',
            filter: 'agTextColumnFilter',
            editable: true,
            headerTooltip: 'Le type stage',
            cellEditor: 'agRichSelectCellEditor',
            cellEditorParams: { values: typeStageValues },
            onCellValueChanged: (data) =>
                updateCourse({ courseId: data.data.id, field: data.colDef.field, newValue: data.newValue }),
        },
        {
            field: 'teachingMethod',
            headerName: 'Méthode enseignement (pédagogique)',
            filter: 'agTextColumnFilter',
            editable: true,
            headerTooltip: 'La méthode enseignement',
            cellEditor: 'agRichSelectCellEditor',
            cellEditorParams: { values: teachingMethodValues },
            onCellValueChanged: (data) =>
                updateCourse({ courseId: data.data.id, field: data.colDef.field, newValue: data.newValue }),
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
                updateCourse({ courseId: data.data.id, field: data.colDef.field, newValue: data.newValue }),
        },
        {
            field: 'formatorType',
            headerName: 'Type - Formateur',
            filter: 'agTextColumnFilter',
            editable: true,
            headerTooltip: 'Le type du formateur',
            onCellValueChanged: (data) =>
                updateCourse({ courseId: data.data.id, field: data.colDef.field, newValue: data.newValue }),
        },
    ]

    const rowData = courses?.map(
        ({
            id,
            name,
            code,
            restrictions: { hidden },
            pricing: { price },
            meta: { created, updated, duration },
            cordinator,
            responsible,
            typeStage,
            teachingMethod,
            codeCategory,
            formatorType,
        }) => ({
            id,
            name,
            code,
            duration,
            price,
            cordinator,
            responsible,
            creationDate: created,
            lastModifiedDate: updated,
            hidden,
            typeStage,
            teachingMethod,
            codeCategory,
            formatorType,
        })
    )

    const [selectedCourseId, setSelectedCourseId] = useState()

    return (
        <>
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
