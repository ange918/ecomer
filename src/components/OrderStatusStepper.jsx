import { ORDER_STATUSES, STATUS_LABELS } from '../utils/orders';

const STEP_ICONS = {
  en_attente: 'bx-receipt',
  acceptee: 'bx-check-circle',
  en_route: 'bx-map-alt',
  livree: 'bx-package',
};

// Frise verticale des statuts d'une commande.
function OrderStatusStepper({ status }) {
  const currentIndex = ORDER_STATUSES.indexOf(status);

  return (
    <ol className="stepper">
      {ORDER_STATUSES.map((step, index) => {
        const state =
          index < currentIndex ? 'done' : index === currentIndex ? 'current' : 'todo';
        return (
          <li key={step} className={`step ${state}`}>
            <span className="step-dot">
              <i className={`bx ${STEP_ICONS[step]}`}></i>
            </span>
            <span className="step-label">{STATUS_LABELS[step]}</span>
          </li>
        );
      })}
    </ol>
  );
}

export default OrderStatusStepper;
