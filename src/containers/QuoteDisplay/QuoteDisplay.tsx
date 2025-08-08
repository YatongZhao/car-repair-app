import React from 'react'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { removeService, clearAllServices } from '../../store/slices/serviceSlice'
import { resetCustomerInfo } from '../../store/slices/customerSlice'
import Button from '../../components/Button'
// import { CURRENCY_SYMBOL } from '../../constants' // Using formatPrice function instead
import './QuoteDisplay.css'

const QuoteDisplay: React.FC = () => {
  const dispatch = useAppDispatch()
  const { info: customerInfo, config } = useAppSelector((state) => state.customer)
  const { selectedServices, totalAmount } = useAppSelector((state) => state.service)

  const handleRemoveService = (serviceId: string) => {
    dispatch(removeService(serviceId))
  }

  const handleClearAll = () => {
    dispatch(clearAllServices())
    dispatch(resetCustomerInfo())
  }

  const handlePrint = () => {
    // Get the quote content element
    const quoteContent = document.querySelector('.quote-display__content')
    if (!quoteContent) return

    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600')
    if (!printWindow) return

    // Get all stylesheets from the current page
    const stylesheets = Array.from(document.styleSheets)
      .map(styleSheet => {
        try {
          return Array.from(styleSheet.cssRules)
            .map(rule => rule.cssText)
            .join('\n')
        } catch (e) {
          // Handle CORS issues with external stylesheets
          return ''
        }
      })
      .join('\n')

    // Create the print document content
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>维修服务报价单</title>
        <style>
          ${stylesheets}
          
          /* Additional print-specific styles */
          @media print {
            @page {
              size: A4;
              margin: 1cm;
            }
            
            body {
              font-family: 'Microsoft YaHei', 'SimSun', sans-serif;
              line-height: 1.4;
              color: #000;
              background: white;
            }
            
            .print-hide {
              display: none !important;
            }
            
            .quote-section {
              break-inside: avoid;
              page-break-inside: avoid;
            }
            
            .service-list {
              border-collapse: collapse;
            }
            
            .quote-total {
              border: 2px solid #000;
              background: #f9f9f9 !important;
            }
            
            .quote-total__final {
              font-weight: bold;
            }
            
            .logo-placeholder {
              background: #666 !important;
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
            }
          }
          
          /* General styles for print window */
          body {
            margin: 0;
            padding: 20px;
            font-family: 'Microsoft YaHei', 'SimSun', sans-serif;
            line-height: 1.4;
          }
          
          .print-hide {
            display: none;
          }
        </style>
      </head>
      <body>
        ${quoteContent.outerHTML}
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          }
        </script>
      </body>
      </html>
    `)

    printWindow.document.close()
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 2,
    })
  }

  // Check if we have any customer info filled
  const hasCustomerInfo = customerInfo.name || customerInfo.phone || customerInfo.carModel || 
                         customerInfo.licensePlate || Object.values(customerInfo.customFields).some(Boolean)

  return (
    <div className="quote-display">
      <div className="quote-display__header">
        <h2 className="quote-display__title">报价单</h2>
        <div className="quote-display__actions print-hide">
          <Button
            variant="secondary"
            size="small"
            onClick={handleClearAll}
            disabled={selectedServices.length === 0 && !hasCustomerInfo}
          >
            重新开始
          </Button>
          <Button
            variant="primary"
            size="small"
            onClick={handlePrint}
            disabled={selectedServices.length === 0}
          >
            打印报价单
          </Button>
        </div>
      </div>

      <div className="quote-display__content">
        {/* Company Header */}
        <div className="quote-header">
          <div className="quote-header__logo">
            <div className="logo-placeholder">
              汽车修理厂
            </div>
          </div>
          <div className="quote-header__info">
            <h1 className="quote-header__title">维修服务报价单</h1>
            <div className="quote-header__date">
              日期：{new Date().toLocaleDateString('zh-CN')}
            </div>
          </div>
        </div>

        {/* Customer Information */}
        {hasCustomerInfo && (
          <div className="quote-section">
            <h3 className="quote-section__title">客户信息</h3>
            <div className="customer-info-grid">
              {customerInfo.name && (
                <div className="info-item">
                  <span className="info-label">客户姓名：</span>
                  <span className="info-value">{customerInfo.name}</span>
                </div>
              )}
              {customerInfo.phone && (
                <div className="info-item">
                  <span className="info-label">联系电话：</span>
                  <span className="info-value">{customerInfo.phone}</span>
                </div>
              )}
              {customerInfo.carModel && (
                <div className="info-item">
                  <span className="info-label">车辆型号：</span>
                  <span className="info-value">{customerInfo.carModel}</span>
                </div>
              )}
              {customerInfo.carYear && (
                <div className="info-item">
                  <span className="info-label">车辆年份：</span>
                  <span className="info-value">{customerInfo.carYear}年</span>
                </div>
              )}
              {customerInfo.licensePlate && (
                <div className="info-item">
                  <span className="info-label">车牌号码：</span>
                  <span className="info-value">{customerInfo.licensePlate}</span>
                </div>
              )}
              
              {/* Custom fields */}
              {config.customFields
                .filter(field => customerInfo.customFields[field.id])
                .sort((a, b) => a.order - b.order)
                .map((field) => (
                  <div key={field.id} className="info-item">
                    <span className="info-label">{field.name}：</span>
                    <span className="info-value">{customerInfo.customFields[field.id]}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Service Items */}
        <div className="quote-section">
          <h3 className="quote-section__title">服务明细</h3>
          {selectedServices.length > 0 ? (
            <div className="service-list">
              <div className="service-list__header">
                <div className="service-header__name">服务项目</div>
                <div className="service-header__category">分类</div>
                <div className="service-header__price">价格</div>
                <div className="service-header__actions print-hide">操作</div>
              </div>
              {selectedServices.map((service) => (
                <div key={service.id} className="service-list__item">
                  <div className="service-item__name">
                    {service.name}
                    {service.isCustom && (
                      <span className="service-item__custom-tag">自定义</span>
                    )}
                  </div>
                  <div className="service-item__category">{service.category}</div>
                  <div className="service-item__price">{formatPrice(service.price)}</div>
                  <div className="service-item__actions print-hide">
                    <button
                      className="remove-button"
                      onClick={() => handleRemoveService(service.id)}
                      title="移除此服务"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-services">
              <p>暂无选择的服务项目</p>
              <p className="empty-services__hint">请在左侧选择需要的服务项目</p>
            </div>
          )}
        </div>

        {/* Total Summary */}
        {selectedServices.length > 0 && (
          <div className="quote-section">
            <div className="quote-total">
              <div className="quote-total__row">
                <span className="quote-total__label">服务项目数量：</span>
                <span className="quote-total__value">{selectedServices.length} 项</span>
              </div>
              <div className="quote-total__row quote-total__final">
                <span className="quote-total__label">总计金额：</span>
                <span className="quote-total__value quote-total__amount">
                  {formatPrice(totalAmount)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="quote-footer">
          <div className="quote-footer__note">
            <p>备注：</p>
            <p>• 本报价单有效期为30天</p>
            <p>• 实际费用可能因车辆具体情况有所调整</p>
            <p>• 如有疑问，请随时联系我们</p>
          </div>
          <div className="quote-footer__signature">
            <div className="signature-line">
              <span>客户签名：</span>
              <div className="signature-box"></div>
            </div>
            <div className="signature-line">
              <span>日期：</span>
              <div className="signature-box"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuoteDisplay