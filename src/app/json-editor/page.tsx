'use client'

import React from 'react'
import AceEditor from 'react-ace'

import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-github'
import 'ace-builds/src-noconflict/ext-language_tools'

const containerStyle: React.CSSProperties = {
	background: 'white',
	display: 'flex',
	width: '100%',
	height: '100%'
}

const errorStyle: React.CSSProperties = {
	color: 'red'
}

export default function JsonEditor() {
	const [error, setError] = React.useState<string>('')

	const onChange = (e: any) => {
		try {
			console.log('Change: ', JSON.parse(e))
			setError('')
		} catch (error: any) {
			setError(error.toString())
		}
	}

	return (
		<>
			<div style={containerStyle}>
				<AceEditor
					mode='json'
					theme='github'
					onChange={onChange}
					name='UNIQUE_ID_OF_DIV'
					editorProps={{ $blockScrolling: true }}
					setOptions={{
						enableBasicAutocompletion: true,
						enableLiveAutocompletion: true,
						enableSnippets: true
					}}
				/>
				<span style={errorStyle}>{error}</span>
			</div>
		</>
	)
}
