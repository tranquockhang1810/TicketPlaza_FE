import { Card, Skeleton } from 'antd';

export default function EventCardSkeleton() {
    return (
        <Card style={{ width: 320, height: 550, margin: '12px' }}>
            <Skeleton active />
        </Card>
    );
}
