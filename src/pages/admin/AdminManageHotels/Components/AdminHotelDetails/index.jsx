import "./AdminHotelDetails.scss";
import { useGetHotelDetailsForAdminQuery } from '../../../../../services/hotelAPI';
import { useParams } from "react-router-dom";
import { Rate, Spin, Tag } from 'antd';
import {
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    SyncOutlined,
    CloseCircleOutlined,
} from '@ant-design/icons';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-geosearch/dist/style.css';
import 'leaflet-geosearch/assets/css/leaflet.css';

// Fix marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

function AdminHotelDetails() {
    const params = useParams();
    const { data, isLoading } = useGetHotelDetailsForAdminQuery(params.hotelId);

    // Sử dụng reduce để gộp các key có giá trị là true thành một mảng duy nhất
    const finalConveniences = data?.data?.conveniences.reduce((acc, convenience) => {
        Object.entries(convenience).forEach(([key, value]) => {
            if (value === true) {
                acc.push(key);
            }
        });
        return acc;
    }, []);

    return (
        <div className="admin-hotel-details-wrapper">
            {data?.data ?
                <div className="card">
                    <div className="hotel-info">
                        <h2 className="item">Hotel Details</h2>
                        <div className="item">
                            {data?.data?.status === "APPROVED" &&
                                < Tag icon={<CheckCircleOutlined />} color="success">
                                    {data?.data?.status}
                                </Tag>
                            }
                            {data?.data?.status === "PENDING" &&
                                < Tag icon={< SyncOutlined spin />} color="processing" >
                                    {data?.data?.status}
                                </Tag >
                            }
                            {data?.data?.status === "REJECTED" &&
                                < Tag icon={< CloseCircleOutlined />} color="error" >
                                    {data?.data?.status}
                                </Tag >
                            }
                            {data?.data?.status === "ACTIVE" &&
                                <Tag icon={<CheckCircleOutlined />} color="success">
                                    {data?.data?.status}
                                </Tag>
                            }
                            {data?.data?.status === "INACTIVE" &&
                                <Tag icon={<ExclamationCircleOutlined />} color="warning">
                                    {data?.data?.status}
                                </Tag>
                            }
                            {data?.data?.status === "CLOSED" &&
                                <Tag icon={<CloseCircleOutlined />} color="error">
                                    {data?.data?.status}
                                </Tag>
                            }
                        </div>
                        <button className="item cancel" type="reset" onClick={() => {
                            window.history.back();
                        }}>
                            <CloseCircleOutlined />
                        </button>
                    </div>
                    <div className="details">
                        <div className="item-50">
                            <label>Hotel Name</label>
                            <p className="input">{data?.data?.hotel_name}</p>
                        </div>
                        <div className="item-25">
                            <label>Rating</label>
                            <Rate className="input" disabled value={Number(data?.data?.rating)} />
                        </div>
                        <div className="item-25">
                            <label>Brand</label>
                            <p className="input">{data?.data?.brand}</p>
                        </div>
                        <div className="item-100">
                            <label>Description</label>
                            <p className="input">{data?.data?.description}</p>
                        </div>
                        <div className="item-100">
                            <label>Business License</label>
                            {data?.data?.business_license?.map((item, index) => (
                                <p key={index} className="input">
                                    <a href={item?.business_license_url} target="_blank" rel="noopener noreferrer">
                                        Business License Image No {index + 1}
                                    </a>
                                </p>
                            ))}
                        </div>
                        <div className="item-100">
                            <h3>Conveniences:</h3>
                            <div className="conveniences">
                                {finalConveniences?.map((item, index) => (
                                    <span key={index} className="sub-item">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="item-100">
                            <h3>Location:</h3>
                            <div className="location">
                                <div className="item-75">
                                    <label>Address</label>
                                    <p className="input">{data?.data?.location?.address}</p>
                                </div>
                                <div className="item-25">
                                    <label>Province*</label>
                                    <p className="input">{data?.data?.location?.province}</p>
                                </div>
                            </div>
                        </div>
                        <div className="item-100">
                            <MapContainer center={[data?.data?.location?.latitude, data?.data?.location?.longitude]} zoom={15} style={{ height: '400px', width: '100%' }}>
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <Marker position={[data?.data?.location?.latitude, data?.data?.location?.longitude]}>
                                    <Popup>
                                        <p className="hotel-name">{data?.data?.hotel_name}</p>
                                        {data?.data?.location?.address}
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        </div>
                    </div>
                    <div className="partner-info">
                        <h2>Partner Info</h2>
                    </div>
                    <div className="details">
                        <div className="item-50">
                            <label>Full Name</label>
                            <p className="input">{data?.data?.partner?.full_name}</p>
                        </div>
                        <div className="item-25">
                            <label>Email</label>
                            <p className="input">{data?.data?.partner?.email}</p>
                        </div>
                        <div className="item-25">
                            <label>Phone</label>
                            <p className="input">{data?.data?.partner?.phone_number}</p>
                        </div>
                    </div>
                </div>
                :
                <Spin spinning={isLoading} style={{ width: "100%" }} />
            }
        </div >
    );
}

export default AdminHotelDetails;