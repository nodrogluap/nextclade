import React, { useRef } from 'react'

import { delay } from 'lodash'
import { connect } from 'react-redux'
import { push } from 'connected-next-router'
import { useTranslation } from 'react-i18next'
import { Button, Col, Row } from 'reactstrap'
import styled from 'styled-components'

import { getSequenceDatum } from 'src/algorithms/defaults/viruses'
import { AlgorithmInput, AlgorithmInputString, AlgorithmParams } from 'src/algorithms/types'
import { FilePicker } from 'src/components/Main/FilePicker'
import { MainSectionHeroFeatures } from 'src/components/Main/MainSectionHeroFeatures'
import {
  algorithmRunAsync,
  exportCsvTrigger,
  removeFasta,
  setFasta,
  setIsDirty,
} from 'src/state/algorithm/algorithm.actions'
import { selectCanExport, selectIsDirty, selectParams } from 'src/state/algorithm/algorithm.selectors'

import type { State } from 'src/state/reducer'
import { setShowInputBox } from 'src/state/ui/ui.actions'
import { FileIconFasta } from './UploaderFileIcons'

export const FilePickerSimple = styled(FilePicker)`
  height: 100%;
`

export interface MainSectionHeroControlsProps {
  params: AlgorithmParams
  canExport: boolean
  showInputBox: boolean
  isDirty: boolean

  setFasta(input: AlgorithmInput): void

  removeFasta(_0: unknown): void

  setInput(input: string): void

  setIsDirty(isDirty: boolean): void

  algorithmRunTrigger(input: AlgorithmInput): void

  exportTrigger(): void

  setShowInputBox(show: boolean): void

  goToResults(): void
}

const mapStateToProps = (state: State) => ({
  params: selectParams(state),
  canExport: selectCanExport(state),
  isDirty: selectIsDirty(state),
  showInputBox: state.ui.showInputBox,
})

const mapDispatchToProps = {
  setIsDirty,
  setFasta,
  removeFasta,
  algorithmRunTrigger: (input: AlgorithmInput) => algorithmRunAsync.trigger(input),
  exportTrigger: () => exportCsvTrigger(),
  setShowInputBox,
  goToResults: () => push('/results'),
}

export const MainSectionHeroControlsSimple = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainSectionHeroControlsDisconnected)

export function MainSectionHeroControlsDisconnected({
  params,
  canExport,
  isDirty,
  showInputBox,
  setInput,
  setIsDirty,
  algorithmRunTrigger,
  exportTrigger,
  setShowInputBox,
  goToResults,
  setFasta,
  removeFasta,
}: MainSectionHeroControlsProps) {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement | null>(null)

  function loadDefaultData() {
    setIsDirty(true)
    setShowInputBox(true)
    inputRef?.current?.focus()
    const seqData = getSequenceDatum(params.virus.name)
    delay(setInput, 250, new AlgorithmInputString(seqData))
  }

  async function onUpload(input: AlgorithmInput) {
    setIsDirty(true)
    setFasta(input)
    // algorithmRunTrigger()
  }

  const errors: string[] = []

  // eslint-disable-next-line unicorn/consistent-function-scoping
  function onError() {}

  return (
    <Row noGutters className="hero-content">
      <Col xl={6} className="px-lg-4 hero-content-left">
        <MainSectionHeroFeatures />
      </Col>

      <Col xl={6} className="hero-content-right">
        <div className="hero-content-left-card">
          <Row>
            <Col>
              <FilePickerSimple
                canCollapse={false}
                defaultCollapsed={false}
                icon={<FileIconFasta />}
                text={t('Sequences')}
                input={params.raw.seqData}
                onInput={onUpload}
                errors={errors}
                onRemove={removeFasta}
                onError={onError}
                inputRef={inputRef}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <Button color="link" onClick={loadDefaultData}>
                <small>{t('Show me an Example')}</small>
              </Button>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  )
}
