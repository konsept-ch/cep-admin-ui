import { Button, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap'

export const ConfirmInscriptionChangeButton = ({ isLoading, variant, onClick, children }) => (
    <OverlayTrigger placement="top" overlay={<Tooltip>Appliquer la modification</Tooltip>}>
        <div>
            <Button disabled={isLoading} variant={variant} onClick={onClick}>
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
