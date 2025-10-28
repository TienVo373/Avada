import React from 'react';
import './NoticationPopup.scss';
import moment from 'moment';
import PropTypes from 'prop-types';

const NotificationPopup = ({
  firstName = 'John Doe',
  city = 'New York',
  country = 'United States',
  productName = 'Puffer Jacket With Hidden Hood',
  timestamp = `${new Date()}`,
  productImage = 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg',
  settings = { hideTimeAgo: false, truncateProductName: false, position: 'bottom-right' },
  onClose,
}) => {
  const truncateString = (str, n) => {
    return str?.length > n ? str.substring(0, n - 1) + '...' : str;
  };

  return (
    <div className={`Avava-SP__Wrapper fadeInUp animated ${settings.position}`}>
      <div className="Avava-SP__Inner">
        <button
          className="Avada-SP__CloseButton"
          onClick={onClose}
          aria-label="Close notification"
        >
          ×
        </button>
        <div className="Avava-SP__Container">
          <a href="#" className={'Avava-SP__LinkWrapper'}>
            <div
              className="Avava-SP__Image"
              style={{
                backgroundImage: `url(${productImage?.trim?.()})`
              }}
            ></div>
            <div className="Avada-SP__Content">
              <div className={'Avada-SP__Title'}>
                {firstName} in {city}, {country}
              </div>
              <div className={'Avada-SP__Subtitle'}>
                purchased {settings.truncateProductName ? truncateString(productName, 16) : productName}
              </div>
              <div className={'Avada-SP__Footer'}>
                {!settings.hideTimeAgo && <>{moment(timestamp).fromNow()} </>}
                <span className="uni-blue">
                  <i className="fa fa-check" aria-hidden="true" /> by Avada
                </span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};
NotificationPopup.propTypes = {
  firstName: PropTypes.string,
  city: PropTypes.string,
  country: PropTypes.string,
  productName: PropTypes.string,
  timeAgo: PropTypes.string,
  productImage: PropTypes.string,
  settings: PropTypes.object,
  timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  onClose: PropTypes.func,
};

export default NotificationPopup;
