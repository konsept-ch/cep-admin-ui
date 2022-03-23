import { Button, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap'

export const ConfirmInscriptionChangeButton = ({
    isSelectedTemplateDataNull,
    isLoading,
    variant,
    onClick,
    children,
}) => (
    <OverlayTrigger
        placement="top"
        overlay={
            <Tooltip>
                {isSelectedTemplateDataNull ? "D'abord sélectionnez un modèle" : 'Appliquer la modification'}
            </Tooltip>
        }
    >
        <div>
            <Button disabled={isSelectedTemplateDataNull} variant={variant} onClick={onClick}>
                {isLoading ? (
                    <>
                        <Spinner animation="grow" size="sm" /> {children}...
                    </>
                ) : (
                    children
                )}
            </Button>
        </div>
    </OverlayTrigger>
)
