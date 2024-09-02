package exceptions

import "github.com/nnniyaz/nop/server/pkg/core"

var ErrInvalidDocumentFilename = core.NewI18NError(core.EINVALID, core.TXT_INVALID_DOCUMENT_FILENAME)
