package exceptions

import "github.com/nnniyaz/nop/pkg/core"

var ErrInvalidDocumentFilename = core.NewI18NError(core.EINVALID, core.TXT_INVALID_DOCUMENT_FILENAME)
