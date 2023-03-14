import { useEffect } from 'react'
import { Button, Spinner, Form, Table as BsTable, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { Packer, Document, HeadingLevel, Paragraph, Table, TableRow, TableCell, WidthType, AlignmentType } from 'docx'

import { CommonModal } from '../components'
import { useGetPresenceListQuery } from '../services/sessions'

export function SessionPresenceListModal({ sessionId, closeModal, isModalOpen }) {
    const { register, reset, watch } = useForm()

    const courseName = watch('courseName')
    const eventDates = watch('eventDates')
    const tutors = watch('tutors')
    const sessionCode = watch('sessionCode')

    const { data: presenceList } = useGetPresenceListQuery(
        { sessionId },
        { refetchOnMountOrArgChange: true, skip: !isModalOpen }
    )

    useEffect(() => {
        if (presenceList != null) {
            reset({
                courseName: presenceList.courseName,
                eventDates: presenceList.eventDates
                    .map((date) =>
                        Intl.DateTimeFormat('fr-CH', { year: 'numeric', month: 'long', day: 'numeric' }).format(
                            new Date(date)
                        )
                    )
                    .join(', '),
                tutors: presenceList.tutors.map(({ firstName, lastName }) => `${lastName} ${firstName}`).join(', '),
                sessionCode: `Liste de présences (${presenceList.sessionCode})`,
            })
        }
    }, [presenceList, reset])

    const learnersCount = presenceList?.learners.length ?? 0

    // TODO: should this happen on the backend instead?
    const generateDocx = () => {
        const doc = new Document({
            sections: [
                {
                    children: [
                        new Paragraph({
                            text: courseName,
                            heading: HeadingLevel.HEADING_1,
                        }),
                        new Paragraph({
                            text: ' ',
                        }),
                        new Paragraph({
                            text: eventDates,
                            heading: HeadingLevel.HEADING_2,
                        }),
                        new Paragraph({
                            text: ' ',
                        }),
                        new Paragraph({
                            text: tutors,
                            heading: HeadingLevel.HEADING_2,
                        }),
                        new Paragraph({
                            text: ' ',
                        }),
                        new Paragraph({
                            text: sessionCode,
                            heading: HeadingLevel.HEADING_2,
                        }),
                        new Paragraph({
                            text: ' ',
                        }),
                        new Table({
                            width: {
                                size: 100,
                                type: WidthType.PERCENTAGE,
                            },
                            margins: {
                                top: 70,
                                bottom: 70,
                                right: 70,
                                left: 70,
                            },
                            rows: [
                                new TableRow({
                                    children: [
                                        new TableCell({
                                            children: [
                                                new Paragraph({
                                                    text: '№',
                                                    heading: HeadingLevel.HEADING_3,
                                                    alignment: AlignmentType.RIGHT,
                                                }),
                                            ],
                                        }),
                                        new TableCell({
                                            children: [
                                                new Paragraph({
                                                    text: 'Nom Prénom',
                                                    heading: HeadingLevel.HEADING_3,
                                                }),
                                            ],
                                        }),
                                        ...(presenceList != null
                                            ? presenceList.eventDates.map(
                                                  (_, index) =>
                                                      new TableCell({
                                                          children: [
                                                              new Paragraph({
                                                                  text: `Jour ${index + 1}`,
                                                                  heading: HeadingLevel.HEADING_3,
                                                                  alignment: AlignmentType.CENTER,
                                                              }),
                                                          ],
                                                      })
                                              )
                                            : []),
                                    ],
                                }),
                                ...(presenceList != null
                                    ? presenceList.learners.map(
                                          ({ firstName, lastName }, index) =>
                                              new TableRow({
                                                  children: [
                                                      new TableCell({
                                                          children: [
                                                              new Paragraph({
                                                                  text: `${index + 1}`,
                                                                  heading: HeadingLevel.HEADING_3,
                                                                  alignment: AlignmentType.RIGHT,
                                                              }),
                                                          ],
                                                      }),
                                                      new TableCell({
                                                          children: [
                                                              new Paragraph({
                                                                  text: `${lastName} ${firstName}`,
                                                                  heading: HeadingLevel.HEADING_3,
                                                              }),
                                                          ],
                                                      }),
                                                      ...(presenceList != null
                                                          ? presenceList.eventDates.map(
                                                                () =>
                                                                    new TableCell({
                                                                        children: [
                                                                            new Paragraph({
                                                                                text: ' ',
                                                                                heading: HeadingLevel.HEADING_3,
                                                                            }),
                                                                        ],
                                                                    })
                                                            )
                                                          : []),
                                                  ],
                                              })
                                      )
                                    : []),
                                ...[...Array(25 - learnersCount)].map(
                                    (_, index) =>
                                        new TableRow({
                                            children: [
                                                new TableCell({
                                                    children: [
                                                        new Paragraph({
                                                            text: `${index + 1 + learnersCount}`,
                                                            heading: HeadingLevel.HEADING_3,
                                                            alignment: AlignmentType.RIGHT,
                                                        }),
                                                    ],
                                                }),
                                                new TableCell({
                                                    children: [
                                                        new Paragraph({
                                                            text: ' ',
                                                            heading: HeadingLevel.HEADING_3,
                                                        }),
                                                    ],
                                                }),
                                                ...(presenceList != null
                                                    ? presenceList.eventDates.map(
                                                          () =>
                                                              new TableCell({
                                                                  children: [
                                                                      new Paragraph({
                                                                          text: ' ',
                                                                          heading: HeadingLevel.HEADING_3,
                                                                      }),
                                                                  ],
                                                              })
                                                      )
                                                    : []),
                                            ],
                                        })
                                ),
                            ],
                        }),
                    ],
                },
            ],
        })

        Packer.toBlob(doc).then((blob) => {
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.setAttribute('href', url)
            a.setAttribute('download', `Présences - ${presenceList.sessionCode.replaceAll('/', '-')}.docx`)
            a.click()
            a.remove()
        })
    }

    return (
        <CommonModal
            title="Liste de présences"
            content={
                <>
                    <Form.Group className="mb-3">
                        <Form.Label>Nom de la formation</Form.Label>
                        <Form.Control {...register('courseName')} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Dates de séances</Form.Label>
                        <Form.Control {...register('eventDates')} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Formateurs</Form.Label>
                        <Form.Control {...register('tutors')} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Code session</Form.Label>
                        <Form.Control {...register('sessionCode')} />
                    </Form.Group>
                    <BsTable bordered>
                        <thead>
                            <tr>
                                <th>№</th>
                                <th>Nom Prénom</th>
                                {presenceList?.eventDates.map((_, index) => (
                                    <th>
                                        {index + 1}
                                        <sup>{`${index + 1}`[0] === '1' ? 'er' : 'e'}</sup> jour
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {presenceList?.learners.map(({ firstName, lastName }, index) => (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>
                                        {lastName} {firstName}
                                    </td>
                                    {presenceList?.eventDates.map(() => (
                                        <td />
                                    ))}
                                </tr>
                            ))}
                            {[...Array(25 - learnersCount)].map((_, index) => (
                                <tr>
                                    <td>{index + 1 + learnersCount}</td>
                                    <td />
                                    {presenceList?.eventDates.map(() => (
                                        <td />
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </BsTable>
                </>
            }
            footer={
                <>
                    <OverlayTrigger placement="top" overlay={<Tooltip>Télécharger Word (.docx)</Tooltip>}>
                        <div>
                            <Button variant="primary" onClick={generateDocx}>
                                {false ? (
                                    <>
                                        <Spinner animation="grow" size="sm" /> Télécharger Word (.docx)...
                                    </>
                                ) : (
                                    'Télécharger Word (.docx)'
                                )}
                            </Button>
                        </div>
                    </OverlayTrigger>
                    <OverlayTrigger placement="top" overlay={<Tooltip>Annuler votre modification</Tooltip>}>
                        <div>
                            <Button
                                variant="outline-primary"
                                onClick={() => {
                                    closeModal()
                                }}
                            >
                                Annuler
                            </Button>
                        </div>
                    </OverlayTrigger>
                </>
            }
            isVisible={isModalOpen}
            onHide={() => closeModal()}
            backdrop="static"
            dialogClassName="update-modal"
        />
    )
}
