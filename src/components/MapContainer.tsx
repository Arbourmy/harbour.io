'use client'

import React, { useState } from 'react';
import { Map, Marker } from 'pigeon-maps';
import COORDS from '@/config';
import { Button } from './ui/button';

export function MapContainer() {
	const [showPrompt, setShowPrompt] = useState(true);

	const hidePrompt = () => {
		setShowPrompt(false);
	};

	return (
		<div className='relative bg-cover bg-center bg-no-repeat' id="map">
			{showPrompt && (
				<>
					<div className="z-[1000] absolute map-ui text-center">
						<p className='text-4xl text-white mb-6 italic font-semibold'>Find your nearest clinic</p>
						<Button onClick={hidePrompt} size="lg" className="px-12 py-6 w-full sm:w-auto border-[2.5px] border-blue-600 bg-transparent font-semibold text-base" variant="default">Show me</Button>
					</div>
					<div className="z-[999] absolute inset-x-0 top-[-1px] bottom-0 bg-blue-600/75 sm:bg-transparent sm:from-blue-500/95 sm:to-blue-500/25 ltr:sm:bg-gradient-to-r sm:bg-gradient-to-l"></div>
				</>
			)}
			<div className='pt-0'>
				<Map height={window.innerHeight} defaultCenter={[3.1390, 101.6869]} defaultZoom={11}>
					{COORDS.map((coordinate, index) => (
						<Marker key={index} width={50} anchor={coordinate as [number, number]} />
					))}
				</Map>
			</div>
		</div>
	);
}

export default MapContainer;
