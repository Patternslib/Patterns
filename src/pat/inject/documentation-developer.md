# Developer Documentation

## Injection flow diagram

    init
      extractConfig
      onTrigger
      onFormActionSubmit
      _initAutoloadVisible
      _initIdleTrigger

    extractConfig

    onTrigger
      execute

    onFormActionSubmit
      extractConfig
      execute

    _initAutoloadVisible
      onTrigger

    _initIdleTrigger
      onTrigger

    execute
      verifyConfig
      askForConfirmation
      elementIsDirty
      _onInjectSuccess
      _onInjectError

     verifyConfig
           verifySingleConfig

    askForConfirmation

    elementIsDirty

    _onInjectSuccess
      destroy
      stopBubblingFromRemovedElement
      _performInjection
      callTypeHandler

    _onInjectError

    verifySingleConfig
      ensureTarget
      listenForFormReset
      extractModifiers

    destroy

    stopBubblingFromRemovedElement

    _performInjection
      _inject
      _afterInjection

    callTypeHandler
          handlers

    ensureTarget
      createTarget

    listenForFormReset

    extractModifiers

    _inject

    _afterInjection

    handlers
     _sourcesFromHtml

     createTarget

    _sourcesFromHtml
     _parseRawHtml

    _parseRawHtml
      _rebaseHTML

    _rebaseHTML

    submitSubform
      execute

    registerTypeHandler
          handlers


