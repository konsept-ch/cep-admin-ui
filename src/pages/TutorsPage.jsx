import { useState, useMemo, useCallback } from 'react'
import { Button, Col, Form, Modal, Row } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import Select from 'react-select'

import { Grid } from '../components'
import { useGetTutorsQuery, useUpdateTutorMutation } from '../services/tutors'

export function TutorsPage() {
    const { register, handleSubmit, reset, control } = useForm()

    const [visible, setVisible] = useState(false)

    const { data: tutors, refetch, isFetching: fetching } = useGetTutorsQuery(null, { refetchOnMountOrArgChange: true })
    const [updateTutor, { isLoading: updating }] = useUpdateTutorMutation()

    const columnDefs = useMemo(
        () => [
            {
                valueGetter: ({ data }) => data,
                cellRenderer: ({ data }) => (
                    <Button
                        variant="primary"
                        onClick={() => {
                            reset({
                                ...data,
                                skills: data.skills.map((v) => ({ v })),
                                roles: data.roles.map((v) => ({ v })),
                                administrative: data.administrative.map((v) => ({ v })),
                                domain: data.domain ? { v: data.domain } : null,
                                status: data.status ? { v: data.status } : null,
                            })
                            setVisible(true)
                        }}
                        size="sm"
                        className="edit-button-style"
                    >
                        <FontAwesomeIcon icon={faPen} />
                    </Button>
                ),
                cellClass: 'edit-column',
                pinned: 'left',
                maxWidth: 60,
                filter: false,
                sortable: false,
            },
            {
                field: 'lastname',
                headerName: 'Nom',
            },
            {
                field: 'firstname',
                headerName: 'Prénom',
            },
            {
                field: 'address',
                headerName: 'Adresse',
            },
            {
                field: 'email',
                headerName: 'E-mail',
            },
            {
                field: 'year',
                headerName: "Année d'entrée",
            },
            {
                field: 'cv',
                headerName: 'CV Envoyé',
                valueGetter: (o) => (o.data.cv ? 'Oui' : 'Non'),
            },
            {
                field: 'cert',
                headerName: 'Certificat envoyé',
                valueGetter: (o) => (o.data.cert ? 'Oui' : 'Non'),
            },
            {
                field: 'title',
                headerName: 'Titre pédagogique',
            },
            {
                field: 'accreditations',
                headerName: 'Accréditations spécifiques tests',
            },
            {
                field: 'skills',
                headerName: 'Compétences clés',
            },
            {
                field: 'training',
                headerName: 'Formation continue',
            },
            {
                field: 'roles',
                headerName: 'Rôles',
            },
            {
                field: 'domain',
                headerName: 'Domaine intervention',
            },
            {
                field: 'cat',
                headerName: 'CAT',
                valueGetter: (o) => (o.data.cat ? 'Oui' : 'Non'),
            },
            {
                field: 'ps',
                headerName: 'PS',
                valueGetter: (o) => (o.data.ps ? 'Oui' : 'Non'),
            },
            {
                field: 'fsm',
                headerName: 'FSM',
                valueGetter: (o) => (o.data.fsm ? 'Oui' : 'Non'),
            },
            {
                field: 'cursus',
                headerName: 'Cursus certifiants',
                valueGetter: (o) => (o.data.cursus ? 'Oui' : 'Non'),
            },
            {
                field: 'status',
                headerName: 'Statut',
            },
            {
                field: 'dates',
                headerName: 'Dates',
            },
            {
                field: 'administrative',
                headerName: 'Suivi administratif',
            },
            {
                field: 'grids',
                headerName: 'Grilles supervision',
            },
            {
                field: 'educational',
                headerName: 'Suivi pédagogique',
            },
        ],
        []
    )

    return (
        <>
            <Helmet>
                <title>Formateurs - Former22</title>
            </Helmet>
            <Grid name="Formateurs" columnDefs={columnDefs} rowData={tutors} isDataLoading={fetching} />
            <Modal dialogClassName="update-modal" backdrop="static" show={visible} onHide={() => setVisible(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Détail</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="email">
                                <Form.Label>E-mail</Form.Label>
                                <Form.Control type="email" {...register('email')} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="year">
                                <Form.Label>Année d'entrée</Form.Label>
                                <Form.Control type="text" {...register('year')} />
                            </Form.Group>
                            <Form.Check type="checkbox" id="cv" label="CV envoyé" {...register('cv')} />
                            <Form.Check type="checkbox" id="cert" label="Certficat envoyé" {...register('cert')} />
                            <Form.Check type="checkbox" id="cat" label="CAT" {...register('cat')} />
                            <Form.Check type="checkbox" id="ps" label="PS" {...register('ps')} />
                            <Form.Check type="checkbox" id="fsm" label="FSM" {...register('fsm')} />
                            <Form.Check
                                type="checkbox"
                                id="cursus"
                                label="Cursus certifiants"
                                {...register('cursus')}
                            />
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="skills">
                                <Form.Label>Compétences clés</Form.Label>
                                <Controller
                                    name="skills"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            options={[
                                                { v: 'Accueil et orientation client' },
                                                { v: 'Administration publique' },
                                                { v: 'Affirmation de soi / assertivité' },
                                                { v: 'Analyse des besoins' },
                                                { v: 'Analyse logique et systémique' },
                                                { v: 'Animation de réunion' },
                                                { v: 'Animation de séances de facilitation' },
                                                { v: 'Animation de séances de formation' },
                                                { v: 'Anticipation / analyse prospective' },
                                                { v: 'Assurances sociales et retraites' },
                                                { v: 'Autonomie responsable' },
                                                { v: 'Cadre de confiance et de sécurité' },
                                                { v: 'Communication / feedback' },
                                                { v: 'Conception de dispositifs de facilitation' },
                                                { v: 'Conception de dispositifs de formation' },
                                                { v: 'Connaissance de soi' },
                                                { v: "Culture de l'erreur" },
                                                { v: 'Délégation' },
                                                { v: 'Durabilité' },
                                                { v: 'Dynamique de groupe' },
                                                { v: 'Ecoute' },
                                                { v: 'Entretiens structurés' },
                                                { v: 'Evaluation / objectifs' },
                                                { v: 'Facilitation' },
                                                { v: 'Gestion de conflits / médiation' },
                                                { v: 'Gestion de projet' },
                                                { v: 'Gestion des émotions' },
                                                { v: 'Gestion du changement / accompagnement' },
                                                { v: 'Gestion du stress' },
                                                { v: 'Gestion du temps / priorités' },
                                                { v: 'Gestion et évaluation des données' },
                                                { v: 'Imagination / créativité' },
                                                { v: 'Inclusion / diversité' },
                                                { v: 'Intelligence collective' },
                                                { v: 'Intelligence émotionnelle' },
                                                { v: 'Leadership' },
                                                { v: 'Mobilisation des parties prenantes' },
                                                { v: 'Motivation / leviers motivationnels' },
                                                { v: 'Négociation' },
                                                { v: 'Neurosciences' },
                                                { v: 'Organisation personnelle' },
                                                { v: 'Pratiques collaboratives' },
                                                { v: 'Prise de décision / Ethique' },
                                                { v: 'Prise de parole' },
                                                { v: 'Processus' },
                                                { v: "Processus d'apprentissage et réflexivité" },
                                                { v: 'Protection numérique' },
                                                { v: 'Questionnement' },
                                                { v: "Recherche d'information" },
                                                { v: 'Recrutement' },
                                                { v: 'Rédaction de documents' },
                                                { v: 'Résolution de problèmes' },
                                                { v: 'Santé et sécurité au travail' },
                                                { v: 'Suivi RH' },
                                                { v: 'Supervision pédagogique' },
                                                { v: 'Technologies numériques' },
                                                { v: 'Technopédagogie' },
                                                { v: 'Vision commune' },
                                            ]}
                                            getOptionLabel={(o) => o.v}
                                            getOptionValue={(o) => o.v}
                                            isMulti
                                        />
                                    )}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="roles">
                                <Form.Label>Rôles</Form.Label>
                                <Controller
                                    name="roles"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            options={[
                                                { v: 'Formateur' },
                                                { v: 'Intervenant / animateur' },
                                                { v: 'Facilitateur' },
                                                { v: 'Coach' },
                                                { v: 'Médiateur' },
                                                { v: 'Expert métier' },
                                            ]}
                                            getOptionLabel={(o) => o.v}
                                            getOptionValue={(o) => o.v}
                                            isMulti
                                        />
                                    )}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="domain">
                                <Form.Label>Domaine intervention</Form.Label>
                                <Controller
                                    name="domain"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            options={[
                                                { v: 'Administration publique' },
                                                { v: 'Méthodologiques et orga' },
                                                { v: 'Personnelles' },
                                                { v: 'Sociales' },
                                                { v: 'Managériales' },
                                                { v: 'Numériques' },
                                                { v: 'Pédagogiques' },
                                                { v: 'Facilitation' },
                                                { v: 'Apprentissages' },
                                            ]}
                                            getOptionLabel={(o) => o.v}
                                            getOptionValue={(o) => o.v}
                                        />
                                    )}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="status">
                                <Form.Label>Statut</Form.Label>
                                <Controller
                                    name="status"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            options={[{ v: 'Actif' }, { v: 'Inactif' }, { v: 'Potentiel' }]}
                                            getOptionLabel={(o) => o.v}
                                            getOptionValue={(o) => o.v}
                                        />
                                    )}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="administrative">
                                <Form.Label>Suivi administratif</Form.Label>
                                <Controller
                                    name="administrative"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            options={[
                                                { v: 'Scénario hybridation / fil rouge' },
                                                { v: 'Descriptif de cours' },
                                                { v: 'Pitch' },
                                                { v: 'Programme' },
                                            ]}
                                            getOptionLabel={(o) => o.v}
                                            getOptionValue={(o) => o.v}
                                            isMulti
                                        />
                                    )}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="address">
                                <Form.Label>Adresse</Form.Label>
                                <Form.Control as="textarea" rows={2} {...register('address')} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="title">
                                <Form.Label>Titre pédagogique</Form.Label>
                                <Form.Control as="textarea" rows={2} {...register('title')} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="accreditations">
                                <Form.Label>Accréditations spécifiques tests</Form.Label>
                                <Form.Control as="textarea" rows={2} {...register('accreditations')} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="training">
                                <Form.Label>Formation continue</Form.Label>
                                <Form.Control as="textarea" rows={2} {...register('training')} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="dates">
                                <Form.Label>Dates</Form.Label>
                                <Form.Control as="textarea" rows={2} {...register('dates')} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="links">
                                <Form.Label>Suivi administratif</Form.Label>
                                <Form.Control as="textarea" rows={2} {...register('links')} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="educational">
                                <Form.Label>Suivi pédagogique</Form.Label>
                                <Form.Control as="textarea" rows={2} {...register('educational')} />
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        disabled={updating}
                        onClick={handleSubmit(async (data) => {
                            const response = await updateTutor({
                                uuid: data.id,
                                data: {
                                    address: data.address,
                                    email: data.email,
                                    year: data.year,
                                    cv: data.cv,
                                    cert: data.cert,
                                    title: data.title,
                                    accreditations: data.accreditations,
                                    training: data.training,
                                    cat: data.cat,
                                    ps: data.ps,
                                    fsm: data.fsm,
                                    cursus: data.cursus,
                                    dates: data.dates,
                                    links: data.links,
                                    educational: data.educational,
                                    skills: data.skills.map((o) => o.v),
                                    roles: data.roles.map((o) => o.v),
                                    administrative: data.administrative.map((o) => o.v),
                                    domain: data.domain?.v,
                                    status: data.status?.v,
                                },
                            })
                            if (response.data) {
                                toast.success(response.data.message)
                                refetch()
                                setVisible(false)
                            }
                        })}
                    >
                        Enregistrer
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
