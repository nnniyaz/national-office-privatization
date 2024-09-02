package exceptions

import "github.com/nnniyaz/nop/server/pkg/core"

var ErrInvalidDocumentLabel = core.NewI18NError(core.EINVALID, core.TXT_INVALID_DOCUMENT_TITLE)
